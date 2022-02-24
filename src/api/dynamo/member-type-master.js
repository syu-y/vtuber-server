import { documentClient } from 'src/api/dynamo/client';

const tableName = process.env.MEMBER_TYPE_MASTER_TABLE;

// 全件取得
const getAllItems = () => {
  const params = { TableName: tableName };
  console.log(params);
  return documentClient.scan(params).promise();
};

export default { getAllItems };
