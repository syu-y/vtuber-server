import memberTypeMasterRepository from 'src/api/dynamo/member-type-master';

/**
 * Vtuber情報取得
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
