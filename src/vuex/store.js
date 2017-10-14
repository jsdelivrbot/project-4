import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import qs from 'qs';
Vue.use(Vuex)
const state = {
    projectId: '',
    subProjectId: '',
    selectContent: '',
    projectBase: '',
    subProjectType: '',
    spaceIds: '',
    backLogId: '',
    currentTaskId: '',
    showListIcon: false,
    showTestIcon: false,
    showTestRunList: false,
    showEditPanel: false,
    showBackLogList: false,
    parentTxt: '',
    childTxt: '',
    isBoardsBackend: false,
    userInfo: {}, // user
    linkedSpaces: {}, //store linked Space
    secondLevel: {
        text: '',
        subType: ''
    },
    backLogRootPath: {
        text: 'Release Backlog',
        subType: '2002'
    },
    backLogFolderPath: {
        text: '',
        subType: ''
    },
    managementInfo: {},
    ownerTasks: [],
    members: [],
    spaceList: [],
    folder: [],
    projectMembers: [],
    linkedSpaceShow: false,
    linkedSpaceName: '',
    TEST: {
        spinShow: false,
        isTestRunTemplateView: false,
        curTestViewId: 1, //board view:1, grid view:2, list view:3
        taskProjectId: 100,
        curTaskFolderId: '',
        curTaskFolderType: 0, // 1:Product, 2:Release, 3:Cycle, 4:Cycle Group
        testTaskColumns: [],
        testTaskFields: [],
        testTaskData: [],
        curTaskId: '',
        TestTask: {
            id: '',
            title: '',
            desc: '',
            owner: '',
            status: '',
            perm: ''
        },

        tempProjectId: '',
        bShowGridView: false,
        headTop: 78
    },
    DEV: {
        loading: false,
        isSearchPanelShow: false,
        devPopTip: false,
        modal: false,
        folderId: '',
        currentPathInfo: {},
        devStatusList: [],
        devBoardTasks: [],
        devStatusIds: [],
        backLogList: [],
        ownerTasks:[]
    },
    MANAGE: {
        loading: false,
        isSearchPanelShow: false,
        manageInfo: {},
        managePathInfo: {},
        manageFolder: [],
        manageStatusList: [],
        manageStatusIds: [],
        managementTasks: []
    },
    DevSpec: {
        reqList: [],
        folderId: -1,
        TotalCount: 0
    }


}
const mutations = {
    getTotalCount(state, TotalCount) {
        state.DevSpec.TotalCount = TotalCount;
    },
    getFolderId(state, folderId) {
        state.DevSpec.folderId = folderId;
    },
    //for requirement
    getReqList(state, reqList) {
        state.DevSpec.reqList = reqList;
    },
    /////////////////////////////////////////////
    addUserInfo(state, user) {
        state.userInfo = user;
    },
    addSpaceList(state, spaceList) {
        state.spaceList = spaceList;
    },
    addMembers(state, members) {
        state.members = members;
    },
    changeProId(state, payload) {
        state.projectId = payload.projectId;
    },
    changeIds(state, payload) {
        state.projectId = payload.projectId;
        state.subProjectId = payload.subProjectId;
    },
    changeContent(state, payload) {
        state.selectContent = payload.selectContent;
    },
    changeProjectBase(state, payload) {
        state.projectBase = payload.projectBase;
    },
    changeProjectBaseSubType(state, payload) {
        state.subProjectType = payload.projectSubType;
    },
    changeSecondLevel(state, payload) {
        state.secondLevel.text = payload.text;
        state.secondLevel.subType = payload.subType;
    },
    addSpaceIds(state, payload) {
        state.spaceIds = payload.spaceIds;
    },
    changeListIcon(state, payload) {
        state.showListIcon = payload.showListIcon
    },
    changeTestIcon(state, payload) {
        state.showTestIcon = payload.showTestIcon
    },
    switchBackLog(state, payload) {
        state.showBackLogList = payload.backLoglist
    },
    changeBackLogId(state, payload) {
        state.backLogId = payload.backLogId
    },
    addBackLogList(state, payload) {
        state.DEV.backLogList = payload;
    },
    changeBackLogRootPath(state, payload) {
        state.backLogRootPath.text = payload.text;
        state.backLogRootPath.subType = payload.subType;
    },
    changeTestLoading(state, spinShow) {
        state.TEST.spinShow = spinShow;
    },
    changeTestRunList(state, payload) {
        state.showTestRunList = payload.testRunList;
    },
    switchTestRunList(state, payload) {
        state.showTestRunList = payload.TestRunList;
    },
    changeEditPanelStatus(state, payload) {
        state.showEditPanel = payload.b == undefined ? payload : payload.b;
    },
    changeTempId(state, payload) {
        state.TEST.tempId = payload.tempId;
    },
    changeCurTaskId(state, payload) {
        state.TEST.curTaskId = payload.curTaskId;
    },
    changeLinkedSpace(state, linkedSpaceObj) {
        state.linkedSpaces = linkedSpaceObj;
    },
    changeBoardsBackend(state, payload) {
        state.isBoardsBackend = payload;
    },
    // changeOwnerTasks(state, payload) {
    //     state.ownerTasks = payload;
    // },
    changeTaskProjectId(state, payload) {
        state.TEST.taskProjectId = payload.taskProjectId;
    },
    changeCurTaskFolderId(state, payload) {
        state.TEST.curTaskFolderId = payload.curTaskFolderId;
    },
    changeTestTaskColumns(state, payload) {
        state.TEST.testTaskColumns = payload.testTaskColumns;
    },
    changeTestTaskFields(state, payload) {
        state.TEST.testTaskFields = payload.testTaskFields;
    },
    changeTestTaskData(state, payload) {
        state.TEST.testTaskData = payload.testTaskData;
    },
    changeisTestRunTemplateView(state, payload) {
        state.TEST.isTestRunTemplateView = payload.isTestRunTemplateView;
    },
    changeCurrentTaskId(state, payload) {
        state.TEST.currentTaskId = payload.currentTaskId;
    },
    changeCurrentTestViewId(state, payload) {
        state.TEST.curTestViewId = payload.curTestViewId;
    },
    changeLinkedName(state, spaceName) {
        state.linkedSpaceName = spaceName;
    },
    changeLinkedSpaceShow(state, spaceLinkShow) {
        state.linkedSpaceShow = spaceLinkShow;
    },
    editDevTask(state, obj) {
        state.DEV.devBoardTasks[obj.statusIndex].children[obj.taskIndex] = obj.taskObj;
    },
    // for development
    updateColumnTasks(state, newTasksObj) {
        //state.DEV.devBoardTasks
    },
    getFolderTree(state, treeList) {
        state.folder = treeList;
    },
    changeDevBoardTasks(state, devTasks) {
        state.DEV.devBoardTasks = devTasks;
    },
    changeProjectMember(state, members) {
        state.projectMember = members;
    },
    changeStatusIds(state, statusIds) {
        state.DEV.devStatusIds = statusIds;
    },
    changeDevLoadingIndex(state, index) {
        let statusIndex = index.statusIndex;
        let currentPageIndex = state.DEV.devBoardTasks[statusIndex].number
        state.DEV.devBoardTasks[statusIndex].number = currentPageIndex + 1
    },
    changeDevColumnTasks(state, tasks) {
        var index = tasks.statusIndex;
        var loadedTask = tasks.tasks;
        for (var i = 0; i < loadedTask.length; i++) {
            state.DEV.devBoardTasks[index].children.push(loadedTask[i]);
        }
    },
    changeDevLoading(state, showLoading) {
        state.DEV.loading = showLoading;
    },
    changeDevFolderId(state, folderId) {
        state.DEV.folderId = folderId;
    },
    changeCurPath(state, pathInfo) {
        state.DEV.currentPathInfo = pathInfo;
    },
    changeSearchPanelShow(state, show) {
        state.DEV.isSearchPanelShow = show;
    },
    changeDevPopTip(state, show) {
        state.DEV.devPopTip = show;
    },
    changeDevModal(state, show) {
        state.DEV.modal = show;
    },
    changeOwnerTasks(state, ownerTasks){
        state.DEV.ownerTasks =  ownerTasks;
    },
    // for management 
    changeManageInfo(state, manageInfo) {
        state.MANAGE.manageInfo = manageInfo;
    },
    changeManageTasks(state, mtasks) {
        state.MANAGE.managementTasks = mtasks;
    },
    changeManageStatusList(state, mList) {
        state.MANAGE.manageStatusList = mList;
    },
    changeManageStatusIds(state, mStatusIds) {
        state.MANAGE.manageStatusIds = mStatusIds;
    },
    changeManageLoadingIndex(state, index) {
        let statusIndex = index.statusIndex;
        let currentPageIndex = state.MANAGE.managementTasks[statusIndex].number
        state.MANAGE.managementTasks[statusIndex].number = currentPageIndex + 1
    },
    changeManageColumnTasks(state, tasks) {
        var index = tasks.statusIndex;
        var loadedTask = tasks.tasks;
        for (var i = 0; i < loadedTask.length; i++) {
            // console.log(index)
            state.MANAGE.managementTasks[index].children.push(loadedTask[i]);
        }
    },
    changeManageFolder(state, projectsArr) {
        state.MANAGE.manageFolder = projectsArr
    },
    changeManageSearchPanel(state, searchShow) {
        state.MANAGE.isSearchPanelShow = searchShow;
    },
    changeManageLoading(state, loadingShow) {
        state.MANAGE.loading = loadingShow;
    },
    changeManagePath(state, pathObj) {
        state.MANAGE.managePathInfo = pathObj;
    }

}
const actions = {
    saveEditTask({ commit }, params) {
        const UPDATE_URL = DevTrackApi + 'task/Update';
        axios.post(UPDATE_URL, qs.stringify(params)).then(res => {
            console.log("update success")
        }, err => {})
    },
    updateTaskMoved({ commit, state }, params) {
        const MOVED_URL = DevTrackApi + 'task/Update';
        /** 
         * moved task params
         * sourceStatusId,targetStatusId
         * dragIndex,dropIndex
         * sourceIndex,targetIndex
         * movedTask object
         */
        axios.post(MOVED_URL, params.param).then(res => {
            if (res.status == 200) {

            } else {
                console.log("The Http Request Reponse A Wrong status Code")
            }
        }, err => {

        })
    },
    changeAssignMember({ commit, state }, memberObj) {
        const UPDATE_URL = DevTrackApi + 'task/Update';
        axios.post(UPDATE_URL, qs.stringify(memberObj)).then(res => {
            console.log(res.data);
        }, err => {})
    },
    getHistory({ commit }, params) {
        const GET_HIStORY_PATH = DevTrackApi + 'UserPreference/Save';
        axios.post(GET_HIStORY_PATH, qs.stringify(params)).then(res => {
            console.log(res)
        }, err => {
            console.log(err)
        })
    },
    getTree({ commit }, params) {
        // console.log("pro:"+params.projectId,"sub"+params.subProjectId);
        var folderTree = []; //存放folder tree nodes
        const GET_TREE = DevTrackApi + '/SubProject/GetTree';
        var nodesParam = {
            "IncludeClosed": true,
            "SubProjectId": 1531,
            "ProjectId": 181,
        }
        axios.post(GET_TREE, nodesParam).then(res => {
            //  console.log(res.data.Data)
            if (res.data.Success) {
                let treeNodes = res.data.Data;
                let projectLevelObj = {
                    "projectId": treeNodes.projectId,
                    "subprojectId": treeNodes.subprojectId,
                    "subprojectName": treeNodes.subprojectName,
                    "subprojectType": treeNodes.subprojectType,
                    "isClosed": treeNodes.isClosed,
                    "hasChild": treeNodes.hasChild,
                    "nodes": []
                }

                folderTree.push(projectLevelObj);
            } else {
                console.log("The http response false")
            }
        }, err => {
            console.log(err)
        })
    },
    // for development
    updateTaskMove({ commit }, params) {
        // updateColumnTasks
        console.log(params)
        var param = {
            "ShowAll": false,
            "PageSize": 15,
            "PageIndex": 1,
            "GetCount": true,
            "SortFieldId": 5,
            "SortOrder": "",
            "Condition": {
                "Subproject": {
                    "SubIds": [
                        state.folderId
                    ],
                    "IncludeChildren": true,
                    "IncludeClosed": true,
                    "IncludeBacklog": false
                },
                "Status": params.statusId
            },
            "ProjectId": state.projectId,
            "FieldIds": [
                101, 601, 108, 104
            ]
        }
        var update = DevTrackApi + 'Task/StoryboardTaskList';
        axios.post(update, param).then(res => {
            console.log(res)
        }, err => {
            console.log(err)
        })
    },
    getStatusList({ commit }, params) {
        const STATUS_URL = DevTrackApi + 'ChoiceList?projectId=' + state.projectId + '&fieldId=601';
        axios.get(STATUS_URL).then(res => {
            if (res.data.Success) {
                state.DEV.devStatusList = res.data.Data;
                console.log(state.DEV.devStatusList)
                    //console.log(state.DEV.devStatusList)
                let temp = [];
                for (let i = 0; i < res.data.Data.length; i++) {
                    temp.push(res.data.Data[i].ChoiceId);
                }
                commit('changeStatusIds', temp)
            } else {
                console.log("http response false")
            }
        }, err => {
            console.log(err)
        })
    },
    getDevBoardTasks({ commit }, params) {
        //console.log(params)
        commit('changeDevLoading', true);
        let getAllStatusTasks = {
            "ShowAll": false,
            "PageSize": 15,
            "PageIndex": 1,
            "GetCount": true,
            "SortFieldId": 5,
            "Condition": {
                "Subproject": {
                    "SubIds": [
                        params.subProjectId
                    ],
                    "IncludeChildren": true,
                    "IncludeClosed": true,
                    "IncludeBacklog": false
                },
                "Status": params.statusIds
            },
            "ProjectId": state.projectId,
            "FieldIds": [
                601, 101, 108, 104, 607
            ]
        };
        //console.log(getAllStatusTasks)
        const BOARD_ALL_URL = DevTrackApi + 'Task/StoryboardTaskList';
        axios.post(BOARD_ALL_URL, getAllStatusTasks).then(res => {
            console.log(res.data)
            if (res.data.Success) {
                var storeDevTasks = res.data.Data;
                let temp = [];
                let devStatusList = state.DEV.devStatusList;
                let quertedDevTasks = res.data.Data;
                devStatusList.forEach(status => {
                    let devStatusColumn = {
                        "ChoiceId": status.ChoiceId,
                        "ChoiceName": status.ChoiceName,
                        "IsActive": status.IsActive,
                        "OrderNo": status.OrderNo,
                        "children": [],
                        "number": 1,
                        "total": 0
                    };
                    for (let i = 0; i < quertedDevTasks.length; i++) {
                        if (status.ChoiceId == quertedDevTasks[i].statusId) {
                            devStatusColumn.children = quertedDevTasks[i].tasks;
                            devStatusColumn.total = quertedDevTasks[i].total;
                        }
                    }
                    temp.push(devStatusColumn);
                })
                commit('changeDevBoardTasks', temp);
                commit('changeDevLoading', false);
            } else {
                console.log("the query methods return false")
            }
        }, err => {
            console.log(err)
        })
    },
    devLoadingTask({ commit }, params) {
        commit("changeDevLoadingIndex", params);
        //console.log(params)
        let pageIndex = state.DEV.devBoardTasks[params.statusIndex].number;
        const TASK_URL = DevTrackApi + 'task/Query';
        var taskParam = {
                "ShowAll": false,
                "PageSize": 15,
                "PageIndex": pageIndex,
                "GetCount": true,
                "SortFieldId": 5,
                "SortOrder": "",
                "Condition": {
                    "Subproject": {
                        "SubIds": [
                            state.subProjectId
                        ],
                        "IncludeChildren": true,
                        "IncludeClosed": true,
                        "IncludeBacklog": false
                    },
                    "Status": [params.statusId]
                },
                "ProjectId": Number(state.projectId),
                "FieldIds": [
                    601, 101, 108
                ]
            }
            //console.log(taskParam)
        axios.post(TASK_URL, taskParam).then(res => {
            console.log(res)
            if (res.status == 200) {
                if (res.data.Success == true) {
                    let tasks = res.data.Data.tasks;
                    let newColumnTasks = [];
                    if (tasks.length > 0) {
                        tasks.forEach(tasksData => {
                            // let childrenObj = {
                            //     "taskId": tasksData.taskId,
                            //     "values": {
                            //         "status": tasksData.values[0].choiceid,
                            //         "title": tasksData.values[1].value,
                            //         "assigned": tasksData.values[2].value,
                            //     }
                            // }
                            newColumnTasks.push(tasksData);
                        })
                        console.log(newColumnTasks)
                            //console.log(newColumnTasks);
                        let columnTasks = {
                            "statusIndex": params.statusIndex,
                            "tasks": newColumnTasks
                        }
                        commit('changeDevColumnTasks', columnTasks)
                    }
                } else {
                    console.log("The Http Response Data Is Unavailable")
                }
            } else {
                console.log("The Http Response A wrong Status Code")
            }
        }, err => {
            console.log(err)
        })
    },
    getMembers({ commit }, params) {
        const GET_MEMBER = DevTrackApi + 'ChoiceList?' + '&projectId=' + params.projectId + '&fieldId=108' + '&languageId=0';
        axios.get(GET_MEMBER).then(res => {
            if (res.data.Success) {
                commit('changeProjectMember', res.data.Data);
            }
        }, err => {
            console.log(err)
        })
    },
    updataDevTask({ commit }, params) {
        var UPDATE_URL = DevTrackApi + 'Task/Update';
        axios.post(UPDATE_URL, params).then(res => {
            console.log(res)
        }, err => {
            console.log(err)
        })
    },
    //changeOwnerTasks
    getOwnerTasks({ commit }, params) {
        var getOwnerTasks = DevTrackApi+'Task/StoryboardTaskList';
        var queryTaskParams = {
            "ShowAll": false,
            "PageSize": 15,
            "PageIndex": 1,
            "GetCount": true,
            "Condition": {
                "Subproject": {
                "SubIds": [
                  params.subProjectId
                ],
                "IncludeChildren": true,
                "IncludeClosed": true,
                "IncludeBacklog": false
                },
                "Status": state.DEV.devStatusIds,
                "Owner": [params.userId]
            },
            "ProjectId": params.projectId,
            "FieldIds": [
                601,101,108,104
            ]
        }
        axios.post(getOwnerTasks,queryTaskParams).then(res=>{
         if(res.data.Success) {
                var OwnerTasks = res.data.Data;
                let temp = [];
                let devStatusList = state.DEV.devStatusList;
                let quertedDevTasks = res.data.Data;
                devStatusList.forEach(status => {
                    let devStatusColumn = {
                        "ChoiceId": status.ChoiceId,
                        "ChoiceName": status.ChoiceName,
                        "IsActive": status.IsActive,
                        "OrderNo": status.OrderNo,
                        "children": [],
                        "number": 1,
                        "total": 0
                    };
                    for (let i = 0; i < quertedDevTasks.length; i++) {
                        if (status.ChoiceId == quertedDevTasks[i].statusId) {
                            devStatusColumn.children = quertedDevTasks[i].tasks;
                            devStatusColumn.total = quertedDevTasks[i].total;
                        }
                    }
                    temp.push(devStatusColumn);
                    commit('changeOwnerTasks', temp);
                })
         }else {
             console.log("The http response false")
         }
        },err=>{
            console.log(err)
        })
    },
    //for management
    getManageStatusList({ commit }, params) {
        const MANAGE_STATUS_URL = DevTrackApi + 'ChoiceList?projectId=' + state.MANAGE.manageInfo.projectId + '&fieldId=601';
        axios.get(MANAGE_STATUS_URL).then(res => {
            if (res.data.Success) {
                console.log(res.data.Data)
                    // state.MANAGE.manageStatusList = res.data.Data;
                let temp = [];
                for (let i = 0; i < res.data.Data.length; i++) {
                    temp.push(res.data.Data[i].ChoiceId);
                }
                commit("changeManageStatusList", res.data.Data)
                commit('changeManageStatusIds', temp)
            } else {
                console.log("http response false")
            }
        }, err => {
            console.log(err)
        })
    },
    getManagementTasks({ commit }, params) {
        let getAllStatusTasks = {
            "ShowAll": false,
            "PageSize": 15,
            "PageIndex": 1,
            "GetCount": true,
            "SortFieldId": 5,
            "Condition": {
                "Subproject": {
                    "SubIds": [
                        state.MANAGE.manageInfo.subProjectId
                    ],
                    "IncludeChildren": true,
                    "IncludeClosed": true,
                    "IncludeBacklog": true
                },
                "Status": state.MANAGE.manageStatusIds
            },
            "ProjectId": state.MANAGE.manageInfo.projectId,
            "FieldIds": [
                601, 101, 108
            ]
        };
        const MANAGE_ALL_URL = DevTrackApi + 'Task/StoryboardTaskList';
        commit('changeManageLoading', true)
        axios.post(MANAGE_ALL_URL, getAllStatusTasks).then(res => {
            if (res.data.Success) {
                //var storeDevTasks=res.data.Data;
                let temp = [];
                let maStatusList = state.MANAGE.manageStatusList;
                let quertedMaTasks = res.data.Data;
                maStatusList.forEach(status => {
                    let maStatusColumn = {
                        "ChoiceId": status.ChoiceId,
                        "ChoiceName": status.ChoiceName,
                        "IsActive": status.IsActive,
                        OrderNo: 0,
                        "children": [],
                        "number": 0,
                        "total": 0
                    };
                    for (let i = 0; i < quertedMaTasks.length; i++) {
                        if (status.ChoiceId == quertedMaTasks[i].statusId) {
                            maStatusColumn.children = quertedMaTasks[i].tasks;
                            maStatusColumn.total = quertedMaTasks[i].total;
                        }
                    }
                    temp.push(maStatusColumn);
                    //console.log(temp)
                })
                commit('changeManageTasks', temp);
                commit('changeManageLoading', false)
            } else {
                console.log("the query methods return false")
            }
        }, err => {
            console.log(err)
        })
    },
    loadManagementTasks({ commit }, params) {
        commit("changeManageLoadingIndex", params);
        let pageIndex = state.MANAGE.managementTasks[params.statusIndex].number;
        const MANAGE_URL = DevTrackApi + 'task/Query';
        var taskParam = {
                "ShowAll": false,
                "PageSize": 15,
                "PageIndex": pageIndex,
                "GetCount": true,
                "SortFieldId": 5,
                "SortOrder": "",
                "Condition": {
                    "Subproject": {
                        "SubIds": [
                            state.MANAGE.manageInfo.subProjectId
                        ],
                        "IncludeChildren": true,
                        "IncludeClosed": true,
                        "IncludeBacklog": false
                    },
                    "Status": [
                        params.statusId
                    ]
                },
                "ProjectId": state.MANAGE.manageInfo.projectId,
                "FieldIds": [
                    601, 101, 108
                ]
            }
            //console.log(taskParam)
        axios.post(MANAGE_URL, taskParam).then(res => {
            if (res.status == 200) {
                if (res.data.Success == true) {
                    let tasks = res.data.Data.tasks;
                    let newColumnTasks = [];
                    if (tasks.length > 0) {
                        tasks.forEach(tasksData => {
                                // console.log(tasksData)
                                // let childrenObj = {
                                //     "taskId": tasksData.taskId,
                                //     "values": [
                                //         {id:601,choiceid:'',name:'',value:''},
                                //         {id:101,name:'',value:''},
                                //         {id:108,choiceid:'',name:'',value:''}
                                //     ]
                                //     // {
                                //     //     "status": tasksData.values[0].choiceid,
                                //     //     "title": tasksData.values[1].value,
                                //     //     "assigned": tasksData.values[2].value,
                                //     // }
                                // }
                                newColumnTasks.push(tasksData);
                            })
                            //console.log(newColumnTasks);
                        let columnTasks = {
                            "statusIndex": params.statusIndex,
                            "tasks": newColumnTasks
                        }
                        console.log(columnTasks)
                        commit('changeManageColumnTasks', columnTasks);

                    }
                } else {
                    console.log("The Http Response Data Is Unavailable or data length is exceed")
                }
            } else {
                console.log("The Http Response A wrong Status Code")
            }
        }, err => {
            console.log(err)
        })
    }
}

export default new Vuex.Store({
    state,
    mutations,
    actions
});