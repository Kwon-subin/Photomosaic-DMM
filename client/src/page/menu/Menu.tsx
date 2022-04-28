import "./Menu.css";
import React, { useEffect, useState, useRef } from "react";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Menu_result from "../../components/menu_result/Menu_result";
import Kakao_map_menu from "../../components/kakao_map_menu/kakao_map_menu";
import axios from "axios";
import { useHistory } from "react-router-dom";

interface store_list {
  id: number;
  address: string;
  avg_rating: number;
  menu_name: string;
  store_name: string;
  num_review: number;
  open_time: string;
  phone_number: string;
  store_img: string;
}

function Menu({ match }: any) {
  // ******************************************************
  // image, star 영역 디스플레이, 포지션 동적 관리
  // 검색 누를경우 사라지지 않는 문제로 인해 생성
  const [chImage, setChImage] = useState<boolean>(false);
  const [imageBox, setImageBox] = useState<string>("");
  const [starNone, setStarNone] = useState<string>("");

  const [menuData, setMenuData] = useState<store_list[]>([]);
  const [starBool, setStarBool] = useState<boolean>(true);
  const history = useHistory();

  const [reviewBool, setReviewBool] = useState<boolean>(true);
  const [isLogin,setIsLogin]=useState<boolean>(true)
  const accessLogin: any = useRef();
  

  
  useEffect(() => {
    (async () => {
      await axios
        .get("https://yummyseoulserver.tk/user/userinfo/userdata", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        })
        .then((res) => {
          setIsLogin(true);
        })
        .catch((err) => setIsLogin(false));
    })();
  }, [isLogin]);

  const handleImg = () => {
    setChImage(!chImage);
    if (chImage) {
      setImageBox("");
      setStarNone("");
    } else {
      setImageBox("menu_result-img-box-hidden");
      setStarNone("menu_result-star-hidden");
    }
  };
  // ******************************************************


  const [menuImage,setMenuImage]=useState<string>("")

  useEffect(() => {
    (async () => {
      const data = await axios.get(
        `https://yummyseoulserver.tk/store/byMenuAndArea/${match.params.menu_name}/${match.params.area_name}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setMenuData(data.data.data);

      const menu_img = await axios.get(
        `https://yummyseoulserver.tk/menu-by-area/image/${match.params.menu_name}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setMenuImage(menu_img.data.data);
      
    })();
  }, []);


  useEffect(() => {}, [starBool, reviewBool,]);

  const star_filter = () => {
    setStarBool(!starBool);

    if (starBool) {
      let data = menuData.sort((a, b) => a.avg_rating - b.avg_rating);
      setMenuData(data);
      //console.log("최소값", data);
    } else {
      let data = menuData.sort((a, b) => b.avg_rating - a.avg_rating);
      setMenuData(data);
      //console.log("최댓값", data);
    }
  };

  const review_filter = () => {
    setReviewBool(!reviewBool);

    if (reviewBool) {
      let data = menuData.sort((a, b) => a.num_review - b.num_review);
      setMenuData(data);
    } else {
      let data = menuData.sort((a, b) => b.num_review - a.num_review);
      setMenuData(data);
    }
  };

  return (
    <>
      <Header
        handleImg={handleImg}
        isLogin={isLogin}
        accessLogin={accessLogin}
      />
      <section className="menu_container">
        <div className="menu_box">
          <div className="menu_infor-box">
            <aside className="menu_infor-box1">
              <div className="menu_infor-container-img">
                <img className="menu_infor-img" src={menuImage} />

              </div>
              <div className="menu_infor-container-text">
                <h4 className="menu_infor-text">
                  {match.params.area_name}의 대표 음식
                </h4>
                <h1 className="menu_infor-text-main">
                  {match.params.menu_name}
                </h1>
              </div>
            </aside>
            <div className="menu_infor-map-box">
              <div className="menu_infor-map">
                <Kakao_map_menu store_list={menuData} />
              </div>
            </div>
          </div>
        </div>
        <div className="menu_list-box">
          <div className="menu_filter-box">
            <button className="menu_filter-btn" onClick={review_filter}>
              리뷰 순
            </button>
            <button className="menu_filter-btn" onClick={star_filter}>
              별점 순
            </button>
          </div>
          <ul className="menu_result-box">
            {menuData.map((item: store_list) => (
              <Menu_result
                imageBox={imageBox}
                starNone={starNone}
                store_list={item}
              />
            ))}
          </ul>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Menu;
