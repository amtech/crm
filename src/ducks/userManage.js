import instance from 'utils/instance'
import { actions as appActions } from './app'
import { message as Msg } from 'antd'
import {
    editorUser,
    deleteUser,
    searchUser,
    editBusiness,
    deleteBusiness,
    getUserListUid,
    getUserListPage,
    getUserBusiness,
} from 'utils/api'

// Actions
export const types = {
    SET_USER:        'userManage/SET_USER',
    SET_USERLISTS:   'userManage/SET_USERLISTS',
    SET_BUSSINESS:   'userManage/SET_BUSSINESS',
    UPDATE_USER:     'userManage/UPDATE_USER',
    DELETE_USER:     'userManage/DELETE_USER',
    UPDATE_BUSINESS: 'userManage/UPDATE_BUSINESS',
    DELETE_BUSINESS: 'userManage/DELETE_BUSINESS',
}

// Action Creators
export const actions = {
    deleteUser: data => ({ type: types.DELETE_USER, data }),
    updateUser: data => ({ type: types.UPDATE_USER, data }),
    getUserDetail: data => ({ type: types.SET_USER, data }),
    deleteBusiness: data => ({ type: types.DELETE_BUSINESS, data }),
    updateBusiness: data => ({ type: types.UPDATE_BUSINESS, data }),
    setBusiness: ({ data, total }) => ({ type: types.SET_BUSSINESS, data, total }),
    setUserLists: ({ data, total }) => ({ type: types.SET_USERLISTS, data, total }),
    agetUserDetail: id => async (dispatch) => {
        try {
            dispatch(appActions.startFetch())
            const result = await instance.get(getUserListUid(id))
            !result.data.success && Msg.error('Not Data!')
            dispatch(actions.getUserDetail(result.data))
            dispatch(appActions.finishFetch())
            return result.data.data
        } catch (err) {
            console.error(err)
            Msg.error('获取用户详情失败！请重试')
            dispatch(appActions.finishFetch())
        }
    },
    aGetUserListPage: page => async (dispatch) => {
        try {
            dispatch(appActions.startFetch())
            const result = await instance.get(getUserListPage(page))
            !result.data.success && Msg.error('Not Data!')
            dispatch(actions.setUserLists(result.data))
            dispatch(appActions.finishFetch())
        } catch (err) {
            console.error(err)
            Msg.error('获取用户列表失败！请重试')
            dispatch(appActions.finishFetch())
        }
    },
    aSearchUser: name => async (dispatch) => {
        try {
            dispatch(appActions.startFetch())
            const result = await instance.get(searchUser(name))
            const { success, message } = result.data
            success ? Msg.info(message) : Msg.error(message)
            dispatch(actions.setUserLists(result.data))
            dispatch(appActions.finishFetch())
        } catch (err) {
            console.error(err)
            Msg.error('搜索用户失败！请重试')
            dispatch(appActions.finishFetch())
        }
    },
    aUpdateUser: data => async (dispatch) => {
        try {
            dispatch(appActions.startFetch())
            const result = await instance.post(editorUser, data)
            const { success, message } = result.data
            success ? Msg.info(message) : Msg.error(message)
            dispatch(actions.updateUser(data))
            dispatch(appActions.finishFetch())
        } catch (err) {
            console.error(err)
            Msg.error('修改用户资料失败！请重试')
            dispatch(appActions.finishFetch())
        }
    },
    aDeleteUser: data => async (dispatch) => {
        try {
            dispatch(appActions.startFetch())
            const result = await instance.post(deleteUser, data)
            const { success, message } = result.data
            success ? Msg.info(message) : Msg.error(message)
            dispatch(actions.deleteUser(data))
            dispatch(appActions.finishFetch())
            return result
        } catch (err) {
            console.error(err)
            Msg.error('删除用户失败！请重试')
            dispatch(appActions.finishFetch())
        }
    },
    aGetUserBusiness: name => async (dispatch) => {
        try {
            dispatch(appActions.startFetch())
            const result = await instance.get(getUserBusiness(name))
            dispatch(actions.setBusiness(result.data))
            dispatch(appActions.finishFetch())
        } catch (err) {
            console.error(err)
            Msg.error('修改用户商机失败！请重试')
            dispatch(appActions.finishFetch())
        }
    },
    aDeleteBusiness: data => async (dispatch) => {
        try {
            dispatch(appActions.startFetch())
            const result = await instance.post(deleteBusiness, data)
            const { success, message } = result.data
            success ? Msg.info(message) : Msg.error(message)
            dispatch(actions.deleteBusiness(data))
            dispatch(appActions.finishFetch())
        } catch (err) {
            console.error(err)
            Msg.error('删除商机失败！请重试')
            dispatch(appActions.finishFetch())
        }
    },
    aUpdateBusiness: data => async (dispatch) => {
        try {
            dispatch(appActions.startFetch())
            const result = await instance.post(editBusiness, data)
            const { success, message } = result.data
            success ? Msg.info(message) : Msg.error(message)
            dispatch(actions.updateBusiness(data))
            dispatch(appActions.finishFetch())
        } catch (err) {
            console.error(err)
            Msg.error('修改商机失败！请重试')
            dispatch(appActions.finishFetch())
        }
    }
}

const initialState = {
    total: null,
    bTotal: null,
    userLists: [],
    business: [],
    currentUser: {}
}

const handle = (state, action) => {
    const data = action.data
    switch (action.type) {
        case types.UPDATE_USER:
            if (state.uid !== data.uid) {
                return state
            }

            return {
                ...state,
                ...data
            }

        case types.SET_USERLISTS:
            return {
                ...state,
                key: state.uid
            }

        case types.DELETE_USER:
            return !data.deleteId.includes(state.uid)

        case types.SET_BUSSINESS:
            return {
                ...state,
                key: state.id
            }

        case types.UPDATE_BUSINESS:
            if (state.id !== data.id) {
                return state
            }

            return {
                ...state,
                ...data
            }

        case types.DELETE_BUSINESS:
            return !data.deleteId.includes(state.uid)

        default:
            return state
    }
}

// Reducer
export default (state = initialState, action) => {
    switch (action.type) {
        case types.UPDATE_BUSINESS:
            return {
                ...state,
                business: state.business.map(item => handle(item, action))
            }

        case types.DELETE_BUSINESS:
            return {
                ...state,
                business: state.business.filter(item => handle(item, action))
            }

        case types.SET_BUSSINESS:
            return {
                ...state,
                bTotal: action.total,
                business: action.data.map(item => handle(item, action))
            }

        case types.SET_USER:
            return {
                ...state,
                currentUser: action.data.data
            }

        case types.SET_USERLISTS:
            return {
                ...state,
                total: action.total,
                userLists: action.data.map(item => handle(item, action))
            }

        case types.UPDATE_USER:
            return {
                ...state,
                userLists: state.userLists.map(item => handle(item, action))
            }

        case types.DELETE_USER:
            return {
                ...state,
                userLists: state.userLists.filter(item => handle(item, action))
            }

        default:
            return state
    }
}