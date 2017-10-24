import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import { Avatar, Table } from 'antd'
import PropTypes from 'prop-types'

// component
import DropOption from 'components/DropOption'
import Modal from './subComponents/Modal'

// actions
import { actions } from 'ducks/userManage'

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User'
    }),
}

@connect(
    state => ({
        ...state.userManage,
        isFetching: state.app.isFetching,
        uid: state.app.user.uid,
        uState: state.app.user.state
    }),
    dispatch => bindActionCreators({ ...actions }, dispatch)
)
class UserManage extends Component {
    constructor() {
        super()
        this.state = {
            modalVisible: false,
            item: {}
        }
    }

    componentWillMount() {
        const { userLists, history } = this.props

        if (userLists.length === 0) {
            this.props.aGetUserListPage(1)
        }
    }

    handleOption = (record, e) => {
        if (e.key === '1') {
            this.setState({
                modalVisible: true,
                item: {
                    ...record,
                    eid: this.props.uid
                }
            })
        }
    }

    onModalOk = (data) => {
        this.props.aUpdateUser(data)
        this.onModalCancel()
    }

    onModalCancel = () => {
        this.setState({ modalVisible: false })
    }

    render() {
        const { userLists, isFetching, total, aGetUserListPage, uState } = this.props
        const { modalVisible, item, modalKey } = this.state
        const pagination = {
            total,
            showQuickJumper: true,
            onChange(page) {
                aGetUserListPage(page)
            }
        }
        const columns = [
            {
                title: '头像',
                dataIndex: 'avatar',
                render: url => <Avatar size="small" src={url} />
            },
            {
                title: '姓名',
                dataIndex: 'name',
                render: text => <a href="#">{text}</a>,
                sorter: (a, b) => a.name.length - b.name.length
            },
            {
                title: '用户名',
                dataIndex: 'user'
            },
            {
                title: '年龄',
                dataIndex: 'age',
                sorter: (a, b) => a.age - b.age,
            },
            {
                title: '性别',
                dataIndex: 'sex',
                render: num => ['男', '女'][num],
                filters: [
                    { text: '男', value: 0 },
                    { text: '女', value: 1 },
                ],
                onFilter: (value, record) => record.sex == value
            },
            {
                title: '权限',
                dataIndex: 'state',
                render: num => ['管理员', '普通'][num]
            },
            {
                title: '手机号码',
                dataIndex: 'tel'
            }
        ]
        const modalProps = {
            item,
            modalKey,
            visible: modalVisible,
            title: 'update',
            onOk: this.onModalOk,
            onCancel: this.onModalCancel,
        }

        if (uState === 0) {
            columns.push({
                title: 'Operation',
                width: 100,
                render: (text, record) => (
                    <DropOption
                        onMenuClick={e => this.handleOption(record, e)}
                        menuOptions={[{ key: '1', name: '更新' }, { key: '2', name: '删除' }]}
                    />
                )
            })
        }

        return (
            <div>
                <Table
                    scroll={{ x: 800 }}
                    dataSource={userLists}
                    columns={columns}
                    loading={isFetching}
                    pagination={pagination}
                    rowSelection={rowSelection}
                />
                { modalVisible && <Modal {...modalProps} /> }
            </div>
        )
    }
}

UserManage.propTypes = {
    uid: PropTypes.number,
    total: PropTypes.number,
    uState: PropTypes.number,
    history: PropTypes.object,
    userLists: PropTypes.array,
    isFetching: PropTypes.bool,
    aUpdateUser: PropTypes.func,
    aGetUserListPage: PropTypes.func,
}

export default UserManage