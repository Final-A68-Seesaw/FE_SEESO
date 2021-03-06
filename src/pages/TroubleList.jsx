import React, { useEffect, useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component'

//redux
import { __loadTrouCardList } from "../redux/modules/touble";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators as TroubleActions } from "../redux/modules/touble";

//element & component
import Header from "../components/Header";
import Footer from "../components/Footer";
import { bold16, bold22 } from "../themes/textStyle";

//style
import styled from "styled-components";
import Line from "../asset/Dictionary_list_line.svg";
import TroubleCard from "../components/TroubleCard";

const TroubleList = () => {

  const TroubleList = useSelector((state) => state.trouble.list)

  const dispatch = useDispatch()
  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(TroubleActions.__loadTrouCardList(1))
  }, [])

  const getData = () => {
    let newPage = page + 1
    if (TroubleList.length < 30) return

    dispatch(__loadDictCardList(newPage))

    setPage(newPage)
  }

  return (
    <>
      <Header />
      <Container>
        <MenuSelection>
          <DictSelect>질문장</DictSelect>
          <Newest>최신순</Newest>
        </MenuSelection>
        <Line style={{ width: "74.5rem" }} />

        <InfiniteScroll
          dataLength={TroubleList.length}
          next={getData}
          hasMore={true}
        >
          <CardWholeBox>
            {TroubleList &&
              TroubleList.map((v, i) => {
                return <TroubleCard key={i} data={v} />;
              })}
          </CardWholeBox>
        </InfiniteScroll>
      </Container>
      <Footer />
    </>
  );
};

export default TroubleList;

const Container = styled.div`
  margin: auto;
  max-width: 75rem;
  padding-top: 5rem;
`;
const MenuSelection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 4rem 0 0 0;
  max-width: 75rem;
`;
const DictSelect = styled.div`
  ${bold22}
  margin-left: 1rem;
`;
const Newest = styled.div`
  ${bold16}
  margin-right: 2rem;
`;
const CardWholeBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 75rem;
  margin-top: 2rem;
`;
