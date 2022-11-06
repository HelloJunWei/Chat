import sinon from 'sinon'
import * as userApi from './user'
console.log(userApi)

const test = sinon.createSandbox()
const mock = test.stub(userApi, 'getUserInfo')
console.log(mock)
export const mockUserInfo = () => {
}

