const BASE_URL = 'http://localhost:3000'; //TODO Add to .env

type ApiService = {
  profile: Function,
  updateProfile: Function,
}
const apiService: any = {};

apiService.profile = function (accessToken:any,user:any) {
  return fetch(`${BASE_URL}/profile`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(user), 
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

apiService.updateUsername = function (accessToken:any,user:any) { //TODO solve type ->in redux userSlice
  return fetch(`${BASE_URL}/updateUsername`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(user), 
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
}


export default apiService;