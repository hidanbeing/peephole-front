import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "../../api/axios";

import Input from "../userMolcules/Input";
import ModalCheckIt from "../userMolcules/ModalCheckIt";

import useToggle from "../../hooks/useToggle";
import useUserStore from "../../store/useUserStore";

export default function LoginForm() {
  const { setUser } = useUserStore();
  const [emailError, setEmailError] = useState(false); // 각종 에러 문구
  const [passwordError, setPasswordError] = useState(false);
  const [showPasswordError, setShowPasswordError, showPasswordToggle] =
    useToggle(false);
  const { register, handleSubmit, watch } = useForm();

  const email = watch("email");
  const password = watch("password");

  const onSubmit = (data) => {
    const loginData = {
      email: data.email,
      password: data.password,
    };
    login(loginData);
  };

  const navigate = useNavigate();
  useEffect(() => {
    const LocalStorage = localStorage.getItem("login");
    if (LocalStorage !== null) {
      navigate.push("/");
    }
  }, []);

  async function login(data) {
    try {
      const resource = await axios.post("/login", data);
      localStorage.setItem("login", resource.data.accessToken);

      await setUserData();
      navigate.push("/");
    } catch (error) {
      setPasswordError(true);

      if (data.email !== "" && data.password !== "") {
        showPasswordToggle(true);
      }
      console.error("로그인 실패:", error);
    }
  }
  const setUserData = async () => {
    try {
      const resource = await axios.get("/user");
      setUser(resource.data);
    } catch (error) {
      console.error("유저 정보 불러오기 실패:", error);
    }
  };

  // const validateEmail = (email) => {
  //   const isvalidateEmail = /\S+@\S+\.\S+/.test(email);
  //   setEmailError(!isvalidateEmail);
  // };

  // useEffect(() => {
  //   if (email !== "") {
  //     validateEmail(email);
  //   } else if (email === "") {
  //     setEmailError(false);
  //   }
  // }, [email]);

  // const validatePassword = (password) => {
  //   const isvalidatePassword = password?.length >= 8; //비밀번호 8자리 이상으로 임의 설정
  //   setPasswordError(!isvalidatePassword);
  // };

  // useEffect(() => {
  //   if (password !== "") {
  //     validatePassword(password);
  //   } else if (password === "") {
  //     setPasswordError(false);
  //   }
  // }, [password]);

  // const handleBlur = (field) => {
  //   return () => {
  //     switch (field) {
  //       case "email":
  //         validateEmail(email);
  //         break;
  //       case "password":
  //         validatePassword(password);
  //         break;
  //       default:
  //         break;
  //     }
  //   };
  // };

  const handleFocus = (field) => {
    return () => {
      switch (field) {
        case "email":
          setEmailError(false);
          break;
        case "password":
          setPasswordError(false);
          break;
        default:
          break;
      }
    };
  };

  const lastCheck =
    !emailError && !passwordError && email !== "" && password !== "";

  return (
    <>
      {showPasswordError && (
        <ModalCheckIt
          text="비밀번호가 일치하지 않습니다."
          submitButton="확인"
          errorMessage={showPasswordToggle}
        />
      )}
      <StyledLoginForm onSubmit={handleSubmit(onSubmit)}>
        <Input
          hookform={register("email", { pattern: /\S+@\S+\.\S+/ })}
          title="이메일"
          placeholder="이메일을 입력해 주세요"
          data="이메일"
          errorMessage={emailError}
          name="email"
          // handleFocus={handleFocus("email")}
          // handleBlur={handleBlur("email")}
        />
        <Input
          hookform={register("password")}
          title="비밀번호"
          placeholder="비밀번호를 입력해 주세요"
          data="password"
          errorMessage={passwordError}
          name="password"
          // handleFocus={handleFocus("password")}
          // handleBlur={handleBlur("password")}
        />
        {lastCheck ? (
          <Button type="submit">로그인</Button>
        ) : (
          <DisableButton>로그인</DisableButton>
        )}
      </StyledLoginForm>
    </>
  );
}

const StyledLoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
`;

const Button = styled.button`
  width: 35.1rem;
  height: 5rem;
  border: none;
  border-radius: 0.8rem;
  background: var(--moss-green);
  color: #fff;
  text-align: center;
  font-size: 1.8rem;
  font-weight: 500;
  cursor: pointer;
`;

const DisableButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  width: 35.1rem;
  height: 5rem;
  border-radius: 0.8rem;
  background: var(--deep-gray);
  color: #fff;
  font-size: 1.8rem;
  font-weight: 500;
`;