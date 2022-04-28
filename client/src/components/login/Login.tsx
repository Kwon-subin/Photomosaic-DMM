import { useEffect, useState } from "react";
import "./Login.css";
import axios from "axios";
import { useHistory } from 'react-router-dom'
/* eslint no-restricted-globals: ["off"] */
//내가 바꾼 함수
const scope =
  "https://www.googleapis.com/auth/userinfo.email " +
  "https://www.googleapis.com/auth/userinfo.profile";

const GOOGLE_LOGIN_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=371793436066-atj1j4im1v6a2a0nkvhvvi1jmgi3rjqr.apps.googleusercontent.com&redirect_uri=https://www.yummyseoul.com/login&response_type=code&scope=${scope}`;
const KAKAO_LOGIN_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=52454432a0f6a96cf545b328c12811ae&redirect_uri=https://www.yummyseoul.com/login`;

interface Iprops {
  loginNone: string;
  handleLgoin: (e: string) => void;
}

interface Infor {
  email: string;
  password: string;
}

function Login(props: Iprops) {
  const [infor, setInfor] = useState<Infor>({
    email: "",
    password: "",
  });

  const [empty, setEmpty] = useState<boolean>(false);
  const [logFail, setLogFail] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [logAni, setLogAni] = useState<string>("");


  const popupX = document.body.offsetWidth / 2 - 500 / 2;
  const popupY = window.screen.height / 2 - 500 / 2;

  const handelKakao = async () => {
    await window.open(
      KAKAO_LOGIN_URL,
      "",
      "status=no, height=500, width=500, left=" +
        popupX +
        ", top=" +
        popupY
    )
  };

  useEffect( () => {
    
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code")
    //axios
    if(code){
      //axios
     axios.post('https://yummyseoulserver.tk/user/kakao_login',
    { authorizationCode: code,
      url: url.href.split('?')[0]}
    ,
    {
      headers: {accept: `application/json`},
      withCredentials: true,
    }).
    then(() => {
      setIsLogin(true)
      opener.parent.location.reload();
      window.close()
      })
    };
},[])

  useEffect( () => {
    
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code")
    //axios
    if(code){
      //axios
     axios.post('https://yummyseoulserver.tk/user/google_login',
    { authorizationCode: code,
      url: url.href.split('?')[0]}
    ,
    {
      headers: {accept: `application/json`},
      withCredentials: true,
    }).
    then(() => {
      setIsLogin(true)
      opener.parent.location.reload();
      window.close()
      })
    };
},[])

  const handelGoogle = async () => {

    await window.open(
      GOOGLE_LOGIN_URL,
      "",
      "status=no, height=500, width=500, left=" +
        popupX +
        ", top=" +
        popupY
    )
    
    // if(isLogin){
    //   await axios.get('https://localhost:4000/user/userinfo/userdata',
    //     {
    //       headers: { "Content-Type": "application/json" },
    //       withCredentials: true,
    //     }).then((res) => 
    //     {
    //       console.log(res)
    //       window.location.replace(window.location.href)
    //     })
    // }
    
  };

  
  // 로그인 모달창 on/off 함수
  const handleNone = () => {
    const inputElement: NodeListOf<Element> =
      document.querySelectorAll(".login_input");

    inputElement.forEach((el) => {
      let data = el as HTMLInputElement;
      data.value = "";
    });

    setLogFail(false);
    setInfor({
      email: "",
      password: "",
    });
    props.handleLgoin("login_hidden");
  };

  const handleInfor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfor({ ...infor, [name]: value });
  };
  const { email, password } = infor;

  useEffect(() => {
    // 입력창 공백상태 확인
    if (email || password || logFail) {
      setEmpty(true);
    } else {
      setEmpty(false);
    }
  }, [email, password]);

  // api 연결
  const handleLogin = async () => {
    const loginData = await axios
      .post(
        "https://yummyseoulserver.tk/user/login",
        {
          email: email,
          password: password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .catch((err) => {
        setLogFail(true);
        setEmpty(true);
        console.log("🚫 Not Found 🚫", err);
        setLogAni("login_input_ani");
      });

    setTimeout(() => {
      setLogAni("");
    }, 1000);

    if (loginData) {
      setLogFail(false);
      // window.location.href: 현 url 주소
      window.location.replace(window.location.href);
    }
  };

  
  return (
    <>
      <div id="demo-modal" className={`login_modal ${props.loginNone}`}>
        <div className="login_overlay"></div>
        <div className="login_content">
          <button className="login_closeBtn" onClick={handleNone}>
            ❌
          </button>
          <section className="login_writing">
            <h1 className="login_title">로그인</h1>
            <div className="login_input-box">
              <input
                className={`login_input ${logAni}`}
                placeholder="이메일"
                type="email"
                name="email"
                onChange={handleInfor}
              />
              <input
                className={`login_input ${logAni}`}
                placeholder="비밀번호"
                type="password"
                name="password"
                onChange={handleInfor}
              />
              <h3 className="login_info-text">
                {empty ? null : "로그인 정보를 입력해주세요!"}
              </h3>
              <h3 className="login_result-text">
                {logFail ? "로그인이 실패되었습니다." : null}
              </h3>
            </div>
            <button className="login_btn" onClick={handleLogin}>
              로그인
            </button>
            <div className="login_OAuth-box">
              <img
                className="login_OAuth"
                src="/oauth/google.jpeg"
                onClick={handelGoogle}
              />
              <img
                className="login_OAuth"
                src="/oauth/kakao.svg"
                onClick={handelKakao}
              />
              
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Login;
