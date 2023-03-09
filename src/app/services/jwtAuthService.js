import axios from "axios";
import localStorageService from "./localStorageService";
import ConstantList from "../appConfig";
import UserService from "../services/UserService";
import MenuService from "../services/MenuService";
import history from "history.js";
import { isAdmin, isHost, isUser } from "app/auth/authRoles";
const config = {
  headers: {
    'Content-Type': 'application/json'
  }
}
class JwtAuthService {


  user = {
    userId: "1",
    role: 'ADMIN',
    displayName: "Watson Joyce",
    email: "watsonjoyce@gmail.com",
    photoURL:  ConstantList.ROOT_PATH+"assets/images/avatar.jpg",
    age: 25,
    token: "faslkhfh423oiu4h4kj432rkj23h432u49ufjaklj423h4jkhkjh"
  }
  async getCurrentUser (){
    let url = ConstantList.API_ENPOINT + "/auth/info";
    return await axios.get(url);
  };
  async loginWithUserNameAndPassword (email, password) {
    let requestBody = {email, password}
    const res = await axios.post(ConstantList.API_ENPOINT + '/auth/login', requestBody, config).then(response=>{
      let data = JSON.parse(atob(response.data.access_token.split('.')[1]));
      let dateObj = new Date(data.exp);
      localStorageService.setSessionItem("token_expire_time", dateObj);
      this.setSession(response.data.access_token);
    });

    await this.getCurrentUser().then(res=>{
      let user = res.data;
      this.setLoginUser(user);
    });

    // await MenuService.getAllMenuItemByRoleList().then(res=>{
    //   localStorageService.setSessionItem("navigations",res.data);
    // });
  };

  loginWithEmailAndPassword = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.user);
      }, 1000);
    }).then(data => {
            //console.log(data);
      this.setUser(data);
      this.setSession(data.token);   
      return data;
    });
  };

  loginWithToken = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.user);
      }, 100);
    }).then(data => {
      this.setSession(data.token);
      this.setUser(data);
      return data;
    });
  };

  

  async logout() {
      let url = ConstantList.API_ENPOINT + "/auth/logout";
      axios.defaults.headers.common["Authorization"] = "Bearer " + localStorageService.getItem("jwt_fes");
      await axios.post(url);
      this.setSession(null);
      this.removeUser();
      history.push({
        pathname: ConstantList.ROOT_PATH
      });
      window.location.reload();
  }

  setSession(token){
    if (token) {
      localStorageService.setItem("jwt_fes", token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    } else {
      localStorageService.removeItem('jwt_fes');
      delete axios.defaults.headers.common["Authorization"];
    }
  };
  async setLoginUser (user) {
    localStorageService.setItem("auth_user", user);
    localStorageService.removeItem('timeout');
    return user;
  }
  getLoginUser = () => {
    return localStorageService.getItem("auth_user");
  }
  // setLoginToken = (data) => {   
  //   let user ={};
  //   user.token = data; 
  //   user.role="ADMIN";
  //   user.age=25;
  //   user.displayName =""; // cần lấy tên user
  //   user.photoURL =ConstantList.ROOT_PATH+"assets/images/avatar.jpg";
  //   this.user = user;
  //   localStorageService.setItem('auth_user', user);
  //   return user;
  // }

  setUser = (user) => {    
    localStorageService.setItem('auth_user', user);

  }
  removeUser = () => {
    localStorageService.removeItem('auth_user');
    localStorageService.removeItem('timeout');
  }
}

export default new JwtAuthService();
