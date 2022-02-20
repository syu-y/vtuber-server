import axios from 'axios';
import youtubeConfig from 'src/api/youtube/youtube.config.json';
import apiKey from 'src/api/youtube/youtube.key.json';

const endpoint = youtubeConfig.getChannelInfo.endpoint;
const part = youtubeConfig.getChannelInfo.part;
const key = apiKey.getChannelInfo;

/**
 * チャンネルIDをキーにチャンネル情報を取得する
 * @param {*} param0 channelId
 */
const getChannelInfo = (channelId) => {
  return axios.get(generateUrlChannelInfo({ channelId }));
};

/**
 * チャンネル情報取得APIのクエリ生成
 * @param {*} param0 channelId
 */
const generateUrlChannelInfo = ({ channelId }) => {
  const url = `${endpoint}?part=${part}&key=${key}&id=${channelId}`;
  console.log(url);
  return url;
};

export default {
  getChannelInfo,
};
