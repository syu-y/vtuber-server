import { documentClient } from 'src/api/dynamo/client';
import vtuberSequense from 'src/api/dynamo/vtuber-sequense';

const tableName = process.env.VTUBER_INFO_TABLE;

// 1件登録
const putItem = async (youtubeInfo, twitterInfo, memberTypeCd) => {
  /** データの重複チェック */
  const channelId = youtubeInfo.channelId;
  const result = await getItem(channelId);
  if (result.Item) {
    throw Error('Date Allready Exists!!');
  }
  const sequenseInfo = await vtuberSequense.nextId();
  const vtuberId = String(sequenseInfo.Attributes.current_number);
  const params = {
    TableName: tableName,
    Item: { channelId, vtuberId, youtubeInfo, twitterInfo, memberTypeCd },
  };

  console.log({ params });
  return documentClient.put(params).promise();
};

// 1件取得
const getItem = async (channelId) => {
  const params = {
    TableName: tableName,
    Key: { channelId: channelId },
  };

  console.log({ params });
  return documentClient.get(params).promise();
};

// 全件取得
const getAllItems = () => {
  const params = { TableName: tableName };
  console.log(params);
  return documentClient.scan(params).promise();
};

export default { putItem, getItem, getAllItems };
