const axios = require('axios');
async function test() {
  try {
    const res = await axios.post("https://stnxcv72dq.ap-south-1.awsapprunner.com/api/v1/wallets/", {
      user_id: "test_" + Date.now(),
      user_type: "CUSTOMER"
    });
    console.log("Success:", res.data);
  } catch (e) {
    if (e.response) {
      console.error("Error data:", e.response.data);
    } else {
      console.error("Error:", e.message);
    }
  }
}
test();
