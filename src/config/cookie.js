// 封装cookie的操作方法
/**
 * 设置cookie
 * @param {*} cname 
 * @param {*} cvalue 
 * @param {*} exdays 
 */
export function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 * 获取cookie
 * @param {*} cname 
 */
export function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
          c = c.substring(1);
       }
      if (c.indexOf(name)  === 0) {
          return c.substring(name.length, c.length);
       }
  }
  return "";
}

/**
 * 检测cookie是否设置
 */
export function checkCookie() {
  var user = getCookie("username");
  if (user !== "") {
      alert("Welcome again " + user);
  } else {
      user = prompt("Please enter your name:", "");
      if (user !== "" && user !== null) {
          setCookie("username", user, 365);
      }
  }
}

/**
 * 清除cookie
 * @param {*} name 
 */
export function clearCookie(name) {
  setCookie(name, "", -1);
}
