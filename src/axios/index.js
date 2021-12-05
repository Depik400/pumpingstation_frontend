import axios from 'axios'

let baseAxios = axios.create({
    baseURL:'http://localhost:8080/public/api'
})

export default  baseAxios;