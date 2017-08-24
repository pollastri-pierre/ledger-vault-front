import axios from 'axios';



export default function checkDomain(domain) {
  const promise = new Promise((resolve, reject) => {
  /*axios.post(
      'start_registration',
      JSON.stringify({ email: emailData }),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    ).then(
      (res) => {
        return true
      }
    ).catch(
      (e) => {
        console.log("zero");
        console.log(e);
        return true
      }*/
    setTimeout(() => { resolve(domain); }, 1000);
  });
  //catch set redirect --> logout -->
  return promise;
}
