import React, { useEffect, useState } from "react";
import { userApi } from "../api/userApi";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

//ele
import Button from "../elements/Button";
import { ErrorXInput } from "../elements/Input";
import Header from "../components/Header";
import Footer from "../components/Footer";

//style
import styled from "styled-components";
import { bold18, med14, med18, bold20 } from "../themes/textStyle";
import { MypageApi } from "../api/mypageApi";
import { __editMyProfile, __loadMypage } from "../redux/modules/mypage";

const MyPageEdit = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.mypage.list);

  //react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  //~캐릭터 카드~
  const [charId, setCharId] = useState([null, null, null]);
  const [charSelect, setCharSelect] = useState([]);
  const [charPrev, setCharPrev] = useState([null, null, null]);

  //map의 기준점이 될 이미지 URL LIST
  const selectFaceList = charSelect.faceUrl;
  const selectAccList = charSelect.accessoryUrl;
  const selectBgList = charSelect.backgroundUrl;

  //이미지 선택시 charId로 값이 들어감
  const changeRadio = (e) => {
    const values = e.target.value.split(",");
    switch (e.target.name) {
      case "faceUrl":
        setCharId([values[1], charId[1], charId[2]]);
        setCharPrev([values[0], charPrev[1], charPrev[2]]);
        break;

      case "accessoryUrl":
        setCharId([charId[0], values[1], charId[2]]);
        setCharPrev([charPrev[0], values[0], charPrev[2]]);
        break;

      case "backgroundUrl":
        setCharId([charId[0], charId[1], values[1]]);
        setCharPrev([charPrev[0], charPrev[1], values[0]]);
        break;
    }
  };
  //닉네임 카드에 미리보기
  const [prevNick, setPrevNick] = useState("");

  const onInputChange = (e) => {
    setPrevNick(e.target.value);
  };

  //Api get
  useEffect(() => {
    dispatch(__loadMypage());
    MypageApi.mypageGet().then((res) => {
      setCharId([
        res.data.profileImages[0].charId,
        res.data.profileImages[1].charId,
        res.data.profileImages[2].charId,
      ]);
      setCharPrev([
        res.data.profileImages[0].profileImage,
        res.data.profileImages[1].profileImage,
        res.data.profileImages[2].profileImage,
      ]);
    });
    userApi.signupCharacter().then((res) => {
      setCharSelect(res.data);
    });
  }, []);

  //데이터전송
  const onSubmit = async (data) => {
    let signDic = {
      nickname: data.nickname,
      profileImages: [charId[0], charId[1], charId[2]],
    };
    dispatch(__editMyProfile(signDic));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Header />
      <Container>
        <TextContainer>프로필수정</TextContainer>

        <OutlineContainer>
          <LeftBox>
            <PrevWorkStage>
              <img
                src={charPrev[0]}
                style={{ width: "22rem", position: "absolute", zIndex: "3" }}
              />
              <img
                src={charPrev[1]}
                style={{ width: "22rem", position: "absolute", zIndex: "2" }}
              />
              <img
                src={charPrev[2]}
                style={{ width: "22rem", position: "absolute", zIndex: "1" }}
              />
            </PrevWorkStage>

            <UserNameTag>
              <PreviewNick>
                {prevNick ? prevNick : userData?.nickname}님은{" "}
              </PreviewNick>
              <Previewmbti>
                {userData.mbti} {userData.generation}
              </Previewmbti>
            </UserNameTag>
          </LeftBox>
          <RightBox>
            <LabelBox>닉네임</LabelBox>
            <ErrorXInput
              type="text"
              name="nickname"
              defaultValue={userData.nickname}
              register={register({
                required: {
                  value: true,
                  message: "⚠ 닉네임을 입력해주세요.",
                },
                maxLength: {
                  value: 8,
                  message: "⚠ 최대 8글자 까지 가능합니다.",
                },
                minLength: {
                  value: 2,
                  message: "⚠ 닉네임은 최소 2글자 이상 입력해주세요.",
                },
              })}
              placeholder="닉네임을 입력해주세요."
              maxLength="9"
              error={errors?.nickname?.message}
              onChange={onInputChange}
            />

            <div>
              <LabelBox>표정</LabelBox>
              {selectFaceList &&
                selectFaceList.map((a, idx) => {
                  return (
                    <label key={idx}>
                      <SelectCharBox
                        {...register("faceUrl")}
                        type="radio"
                        name="faceUrl"
                        onChange={changeRadio}
                        value={[a.profileImage, a.charId]}
                      />
                      <SelectCharSource>
                        <CharContain>
                          <img
                            src={a.profileImage}
                            style={{
                              width: "4rem",
                              height: "4rem",
                              borderRadius: "0.75rem",
                            }}
                          />
                        </CharContain>
                      </SelectCharSource>
                    </label>
                  );
                })}
            </div>
            <div>
              <LabelBox>악세사리</LabelBox>
              {selectAccList &&
                selectAccList.map((a, idx) => {
                  return (
                    <label key={idx}>
                      <SelectCharBox
                        {...register("accessoryUrl")}
                        type="radio"
                        name="accessoryUrl"
                        onChange={changeRadio}
                        value={[a.profileImage, a.charId]}
                      />
                      <SelectCharSource>
                        <CharContain>
                          <img
                            src={a.profileImage}
                            style={{
                              width: "4rem",
                              height: "4rem",
                              borderRadius: "0.75rem",
                            }}
                          />
                        </CharContain>
                      </SelectCharSource>
                    </label>
                  );
                })}
            </div>
            <div>
              <LabelBox>배경</LabelBox>
              {selectBgList &&
                selectBgList.map((a, idx) => {
                  return (
                    <label key={idx}>
                      <SelectCharBox
                        {...register("backgroundUrl")}
                        type="radio"
                        label="배경"
                        name="backgroundUrl"
                        onChange={changeRadio}
                        value={[a.profileImage, a.charId]}
                      />
                      <SelectCharSource>
                        <CharContain>
                          <img
                            src={a.profileImage}
                            style={{
                              width: "4rem",
                              height: "4rem",
                              borderRadius: "1rem",
                            }}
                          />
                        </CharContain>
                      </SelectCharSource>
                    </label>
                  );
                })}
            </div>
          </RightBox>
        </OutlineContainer>
        <FinalConfirm width="24rem" type="submit">
          수정완료
        </FinalConfirm>
      </Container>
      <Footer />
    </form>
  );
};

const Container = styled.div`
  padding-top: 9rem;
  margin: auto;
  max-width: 44rem;
  text-align: center;
`;

const TextContainer = styled.div`
  text-align: center;
  margin: 0.1rem;
  ${bold20}
  color: #242424;
`;
const OutlineContainer = styled.div`
  margin-top: 2.5rem;
  height: 57%;
  justify-content: space-between;
  display: flex;
`;

const PrevWorkStage = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  top: 100px;
`;

const FinalConfirm = styled(Button)`
  width: 24rem;
`;

const LabelBox = styled.div`
  ${med14}
  text-align: left;
`;
const RightBox = styled.div`
  width: 21rem;
`;
const LeftBox = styled.div`
  /* width: 20rem; */
`;
const UserNameTag = styled.div`
  border: 3px solid #ea8c00;
  height: 2.5rem;
  width: 20rem;
  border-radius: 12px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.08),
    0px 8px 16px -4px rgba(22, 34, 51, 0.08);
  color: #ea8c00;
  padding: 1rem 0;
`;
const PreviewNick = styled.div`
  ${bold18}
`;

const Previewmbti = styled.div`
  ${med18}
`;
const CharContain = styled.div`
  width: 4rem;
  height: 4rem;
`;
const SelectCharSource = styled.span`
  margin: 0.8rem 0.3rem 2.3rem 0.3rem;
  width: 4rem;
  height: 4rem;
  line-height: 4rem;
  background-color: var(--grayed);
  border: 3px solid transparent;
  border-radius: 0.75rem;

  display: inline-block;
  cursor: pointer;
`;
const SelectCharBox = styled.input`
  &:checked {
    display: inline-block;
    background: none;
    padding: 0px 10px;
    text-align: center;
    height: 33px;
    line-height: 33px;
    font-weight: 500;
    display: none;
    border: 3px solid transparent;
  }
  &:checked + ${SelectCharSource} {
    border: 3px solid var(--yellow);
  }
  display: none;
`;
export default MyPageEdit;
