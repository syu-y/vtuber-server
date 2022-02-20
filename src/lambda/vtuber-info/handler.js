import axios from 'axios';
import cheerio from 'cheerio';
import vtuberInfoRepository from 'src/api/dynamo/vtuber-info';
import youtubeApi from 'src/api/youtube/channel-info';
import twitterApi from 'src/api/twitter/twitter-info';
import {
  URL_YOUTUBE_RSS,
  URL_YOUTUBE_CHANNEL,
  URL_TWITTER,
} from 'src/lambda/vtuber-info/const';

/**
 * Vtuber情報取得
 * @param {*} event
 * @param {*} context
 * @param {*} callback
 * @returns
 */
export const getAllVtuberInfo = async (event, context, callback) => {
  try {
    const vtuberInfoList = await vtuberInfoRepository.getAllItems();
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
        'Access-Control-Allow-Headers':
          'Content-Type, Authorization, access_token',
      },
      body: JSON.stringify({ vtuberInfoList: vtuberInfoList }),
    };
    callback(null, response);
  } catch (error) {
    console.log(error);
  }
  return { statusCode: 200 };
};

/**
 * Vtuber情報登録
 * @param {*} event
 * @param {*} context
 * @param {*} callback
 * @returns
 */
export const putVtuberInfo = async (event, context, callback) => {
  // ログ出力（パラメータ）
  const channelId = event.channelId;
  const twitterName = event.twitterName;
  console.log('channelId : ' + channelId);
  console.log('twitterName : ' + twitterName);

  // Youtube情報を取得
  const youtubeApiResponse = await youtubeApi.getChannelInfo(channelId);
  if (!youtubeApiResponse.data) return { statusCode: 500 };
  const allData = youtubeApiResponse.data.items[0];
  const youtubeInfo = createYoutubeInfo(allData);
  console.log(youtubeInfo);

  // Twitter情報を取得
  const twitterApiResponse = await twitterApi.getUserInfo(twitterName);
  if (!twitterApiResponse) return { statusCode: 500 };
  const twitterInfo = createTwitterInfo(twitterApiResponse);
  console.log(twitterInfo);

  try {
    // DBに登録
    await vtuberInfoRepository.putItem(youtubeInfo, twitterInfo);
  } catch (error) {
    console.log(error);
    return {
      statusCode: error.statusCode || 500,
      body: error.message,
    };
  }
  return { statusCode: 200 };
};

/**
 * 登録情報（YouTube）生成
 * @param {*} responseData
 * @returns
 */
const createYoutubeInfo = (responseData) => {
  const youtubeInfo = {
    title: responseData.snippet.title,
    description: responseData.snippet.description,
    icon: responseData.snippet.thumbnails.default.url,
    startDate: responseData.snippet.publishedAt,
  };
  return youtubeInfo;
};

/**
 * 登録情報（Twitter）生成
 * @param {*} responseData
 * @returns
 */
const createTwitterInfo = (responseData) => {
  // デフォルトのアイコンサイズが小さいためリサイズしたアイコンのURLも保持しておく
  // ファイル名末尾のnormalを400x400で置換する
  const originalIconUrl = responseData.profile_image_url_https;
  const iconUrl = originalIconUrl.replace('normal', '400x400');

  const twitterInfo = {
    id: responseData.id_str,
    name: responseData.name,
    screen_name: responseData.screen_name,
    description: responseData.description,
    url: URL_TWITTER + responseData.screen_name,
    iconUrl: iconUrl,
    originalIconUrl: originalIconUrl,
  };
  return twitterInfo;
};
