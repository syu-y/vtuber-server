import { documentClient } from 'src/api/dynamo/client';

const tableName = process.env.VTUBER_ID_SEQUENCE;

// 1件登録
const nextId = () => {
  const params = {
    TableName: tableName,
    ReturnValues: 'ALL_NEW',
    Key: {
      name: 'atomic',
    },
    UpdateExpression: 'ADD #current_number :incr',
    ExpressionAttributeNames: {
      '#current_number': 'current_number',
    },
    ExpressionAttributeValues: {
      ':incr': 1,
    },
  };

  console.log({ params });
  return documentClient.update(params).promise();
};

export default { nextId };
