import { documentClient } from 'src/api/dynamo/client';
import vtuberSequense from 'src/api/dynamo/vtuber-sequense';

const tableName = process.env.VTUBER_INFO_TABLE;

// 1件登録
const putItem = async (youtubeInfo, twitterInfo) => {
  //
  const sequenseInfo = await vtuberSequense.nextId();
  const vtuberId = String(sequenseInfo.Attributes.current_number);
  const params = {
    TableName: tableName,
    Item: { vtuberId, youtubeInfo, twitterInfo },
  };

  console.log({ params });
  return documentClient.put(params).promise();
};

// 全件取得
const getAllItems = () => {
  const params = { TableName: tableName };
  console.log(params);
  return documentClient.scan(params).promise();
};

export default { putItem, getAllItems };
