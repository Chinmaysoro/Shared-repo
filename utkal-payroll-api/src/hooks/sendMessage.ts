import axios from 'axios';

export const sendMessage = async (app: any, option: any) => {
  const { to, text } = option;

  const data = JSON.stringify({"OTP":text});

  const config = {
    method: 'get',
    url: `https://api.msg91.com/api/v5/otp?template_id=62692dedbc93497f841a73d6&mobile=${to}&authkey=375667AXGSmDwxW625691c0P1`,
    headers: {
      'Content-Type': 'application/json',
    },
    data : data
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });


};

export default sendMessage;
