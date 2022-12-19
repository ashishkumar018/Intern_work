function test(){
  let uid, pw;
  uid= document.getElementById("username").value;
  pw= document.getElementById("password").value;

  localStorage.setItem("user's name",uid);
  localStorage.setItem("user's password",pw);
}