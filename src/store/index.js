import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

let vStore = new Vuex.Store({
    state: {
        name: '',
        isAuthentificated:false,
        orgName: '',
        graph: '',
    },
    mutations: {
        updateName(state, data) {
            state.name = data;
        },

        updateGraph(state,data) {
            state.graph = data;
        }
        ,
        updateAuthentificatedState(state,data){
            state.isAuthentificated = data;
        },

        updateOrganizationName(state,data) {
            state.orgName = data;
        }

    },

    actions: {
        setName({commit}, data) {
            commit('updateName',data);
        },
        setAuthentificatedState({commit},data){
            commit('updateAuthentificatedState',data);
        },

        setOrganizationName({commit},data) {
            commit('updateOrganizationName',data);
        },

        setGraph({commit},data) {
            commit('updateGraph',data);
        }
    },
    getters:{
        NAME(state){
            return state.name;
        },
        ORGNAME(state){
            return state.orgName;
        },
        AUTHSTATE(state){
            return state.isAuthentificated;
        },

        GRAPH(state){
            return state.graph;
        }
    }
})
export default vStore;



