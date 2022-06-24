import memberTypeMasterRepository from 'src/api/dynamo/member-type-master';

/**
 * MemberType情報取得
 * @param {*} event
 * @param {*} context
 * @param {*} callback
 * @returns
 */
export const getMemberTypes = async (event, context, callback) => {
  try {
    const memberTypes = await memberTypeMasterRepository.getAllItems();
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
        'Access-Control-Allow-Headers':
          'Content-Type, Authorization, access_token',
      },
      body: JSON.stringify({ memberTypes: memberTypes }),
    };
    callback(null, response);
  } catch (error) {
    console.log(error);
  }
  return { statusCode: 200 };
};

/**
 * MemberType情報登録
 * @param {*} event
 * @param {*} context
 * @param {*} callback
 * @returns
 */
export const putMemberType = async (event, context, callback) => {
  console.log('event : ' + event);
  if (!event.queryStringParameters) return { statusCode: 500 };
  // ログ出力（パラメータ）
  const { memberTypeCd, memberTypeName } = event.queryStringParameters;
  console.log('memberTypeCd : ' + memberTypeCd);
  console.log('memberTypeName : ' + memberTypeName);

  try {
    // DBに登録
    await memberTypeMasterRepository.putItem(memberTypeCd, memberTypeName);
  } catch (error) {
    console.log(error);
    return {
      statusCode: error.statusCode || 500,
      body: error.message,
    };
  }
  return { statusCode: 200 };
};
