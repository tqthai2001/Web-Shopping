import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import Tippy from "@tippyjs/react/headless";

import currencyFormat from "../../utils/displayPrice";
import { stopLogin } from "../../actions/user";
import { removeCart } from "../../actions/cart";
import { useSubscription, gql } from "@apollo/client";

import brandLogo from "../../assets/images";
import "../../assets/style/style.css";

const LISTEN_EVENT_ORDER = gql`
  subscription Subscription($userId: Int) {
    OrderUpdate(userId: $userId) {
      id
      status
    }
  }
`;

const LISTEN_NEW_EVENT_ORDER = gql`
  subscription Subscription {
    NewOrder {
      id
    }
  }
`;

const Header = ({
  user,
  cart,
  removeCart,
  logout,
  product,
  search = true,
  showPro,
  showUser,
  showOrder,
  sale,
  voucher,
  event,
  offProduct,
}) => {
  // Search box
  const [inputSearch, setInputSearch] = useState("");
  const [showResult, setShowResult] = useState(false);
  const resultArray = product.filter((item) => {
    return (
      item.name
        .slice(0, item.name.length - 10)
        .toLowerCase()
        .indexOf(inputSearch.toLowerCase()) !== -1
    );
  });
  useEffect(() => {
    if (inputSearch.length > 0) {
      setShowResult(true);
    } else {
      setShowResult(false);
    }
  }, [inputSearch.length]);
  const handleInputSearch = (e) => {
    setInputSearch(e);
  };

  // Notification
  const [notifyCnt, setNotifyCnt] = useState(0);
  const appState = useSelector((state) => state);
  const orders = appState.User.orders;
  const orderCnt = orders.reduce((amount, order) => {
    if (order.status === "Đang giao hàng") {
      return amount + 1;
    }
    return amount;
  }, 0);

  useEffect(() => {
    // Notification event
    if (appState.Event !== 0 && user.admin === false && user.staff === false) {
      const notifyEvent = document.querySelector(
        ".notify-event .notify-item__text"
      );
      // notifyEvent.innerHTML =  `Sự kiện siêu khuyến mãi, giảm giá ${appState.Event}% toàn bộ sản phẩm. Nhanh tay đặt hàng để sử dụng`;
    }

    // Notification voucher
    const voucherCnt = appState.Voucher.length + appState.VoucherPremium.length;
    if (voucherCnt !== 0 && user.admin === false && user.staff === false) {
      const notifyVoucher = document.querySelector(
        ".notify-voucher .notify-item__text"
      );
      // notifyVoucher.innerHTML =  `Bạn đang có ${voucherCnt} mã giảm giá trong ví. Mua hàng để sử dụng`;
    }

    // Notification read unread
    setNotifyCnt(document.querySelectorAll(".unread").length);
    const onClickNotify = (e) => {
      e.currentTarget.classList.remove("unread");
      setNotifyCnt(document.querySelectorAll(".unread").length);
    };

    const notifyElements = document.querySelectorAll(".notify-item");
    notifyElements.forEach((element) => {
      element.addEventListener("click", onClickNotify);
    });
  }, [
    appState.Event,
    appState.Voucher,
    appState.VoucherPremium,
    appState.User,
  ]);

  // Fade in, Fade out Nav Bar
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const navBar = document.getElementById("ftco-navbar");
    const position = window.pageYOffset;
    setScrollPosition(position);
    if (position > 50) {
      if (!navBar.classList.contains("scrolled")) {
        navBar.classList.add("scrolled");
      }
    }
    if (position < 50) {
      if (navBar.classList.contains("scrolled")) {
        navBar.classList.remove("scrolled");
        navBar.classList.remove("sleep");
      }
    }
    if (position > 120) {
      if (!navBar.classList.contains("awake")) {
        navBar.classList.add("awake");
      }
    }
    if (position < 120) {
      if (navBar.classList.contains("awake")) {
        navBar.classList.remove("awake");
        navBar.classList.add("sleep");
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  // End Fade in, Fade out Nav Bar

  const { loading, data } = useSubscription(LISTEN_EVENT_ORDER, {
    variables: { userId: user.id },
  });
  const newOrder = useSubscription(LISTEN_NEW_EVENT_ORDER);
  const [flag, setFlag] = useState(false);

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark ftco-navbar-light"
        id="ftco-navbar"
      >
        <div className="container">
          <Link to="/">
            <img src={brandLogo.logo} alt="Eva De Eva" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#ftco-nav"
            aria-controls="ftco-nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="fa-solid fa-bars"></span> Menu
          </button>

          <div className="collapse navbar-collapse" id="ftco-nav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/products" className="nav-link">
                  Shop
                </Link>
              </li>
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  id="dropdown04"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Admin
                </Link>
                <div class="dropdown-menu" aria-labelledby="dropdown04">
                  <Link to="" className="dropdown-item">
                    Shop
                  </Link>
                  <Link to="" className="dropdown-item">
                    Shop
                  </Link>
                  <Link to="" className="dropdown-item">
                    Shop
                  </Link>
                </div>
              </li>
              <li className="nav-item">
                <Link to="/admin-order" className="nav-link">
                  Staff
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Contact
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/account" className="nav-link">
                  <span className="fa-solid fa-user"></span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/user" className="nav-link">
                  <span className="fa-solid fa-bell"></span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/cart" className="nav-link">
                  <span className="fa-solid fa-cart-shopping"></span>{" "}
                  <span>[{cart.length}]</span>
                </Link>
              </li>
            </ul>

            <div className="row">
              <div
                className="search-box-wrapper"
                style={{ marginLeft: "2.5rem" }}
              >
                <Tippy
                  visible={showResult}
                  placement="bottom-start"
                  interactive
                  render={(attrs) => (
                    <div tabIndex="-1" {...attrs}>
                      <div className="search-result-wrapper">
                        {resultArray.length !== 0 ? (
                          <div>
                            {resultArray.map((item, index) => {
                              return (
                                index <= 3 && (
                                  <div
                                    className="search-result-item"
                                    key={index}
                                  >
                                    <div className="search-result-img">
                                      <Link to={`/detail/${item.codePro}`}>
                                        <img
                                          src={item.img_1}
                                          alt="Cart-Mini-Image"
                                        />
                                      </Link>
                                    </div>
                                    <div className="search-result-content">
                                      <Link to={`/detail/${item.codePro}`}>
                                        <div>
                                          {item.name.slice(
                                            0,
                                            item.name.length - 10
                                          )}
                                        </div>
                                        <div>{item.price}đ</div>
                                      </Link>
                                    </div>
                                  </div>
                                )
                              );
                            })}
                          </div>
                        ) : (
                          <div style={{ marginLeft: "38px" }}>
                            Không tìm thấy sản phẩm
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                >
                  <form action="search" className="pl-1">
                    <div className="d-flex">
                      <input
                        required
                        type="text"
                        className="search-input"
                        autoFocus={true}
                        placeholder="Search"
                        value={inputSearch}
                        onChange={(e) => {
                          handleInputSearch(e.target.value);
                        }}
                      />
                      <button
                        type="submit"
                        value=""
                        className="btn-search fas fa-search submit"
                      />
                    </div>
                  </form>
                </Tippy>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.User,
    cart: state.Cart,
    product: [...state.Product, ...state.Accessory],
    sale: state.Event,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeCart: (id, size) => dispatch(removeCart(id, size)),
    logout: () => dispatch(stopLogin()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
