import Twitter from 'twitter';
import twitterConfig from 'src/api/twitter/twitter.config.json';
import apiKey from 'src/api/twitter/twitter.key.json';

const client = new Twitter({
  consumer_key: apiKey.apiKey,
  consumer_secret: apiKey.apiSecretKey,
  access_token_key: apiKey.accessToken,
  access_token_secret: apiKey.accessTokenSecret,
});

/**
 * ユーザ名をキーにユーザ情報を検索する
 * @param {*} param0 name
 */
const getUserInfo = (name) => {
  const users = client.get('users/show', { screen_name: name });
  return users;
};

export default {
  getUserInfo,
};
