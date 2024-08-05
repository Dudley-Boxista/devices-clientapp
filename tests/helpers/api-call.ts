export const makeApiCall = async (
    t: TestController, 
    url: string,
    method: string = 'get',
    body: object = {},
    responseStatus: number = 200
): Promise<ResponseAPI | ResponseOptions> => {
    const response = await t.request({url, method, body});
    await t.expect(response.status).eql(responseStatus);
    return response;
}