import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { SmFont, SmFontContainer, RedBox, BlueBox, RedTriangle, BlueTriangle } from '../Style/Stock';
import CommaGenerator from '../Function/CommaGenerator';
import NumberToKR from '../Function/NumberToKR';
import styled from 'styled-components';

const Table = styled.table`
    margin-top: 10px;
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9em;
    min-width: 400px;
    border-radius: 5px 5px 0 0;
    overflow: hidden;

    th,
    td {
        width: 20%;
        padding: 12px 15px;
    }

    thead tr {
        font-size: 1.3em;
        font-weight: bold;
        color: #555;
        text-align: left;
        font-weight: bold;
        border-bottom: 1px solid #373737;
    }

    tbody tr {
        border-bottom: 1px solid #eee;
        font-size: 1.1em;
        height: 70px;
        cursor: pointer;

        .red {
            color: red;
        }
        .blue {
            color: blue;
        }
        :hover {
            background-color: #c7d3ef;
        }
    }
    tbody tr:nth-of-type(even) {
        background-color: #f3f3f3;
        :hover {
            background-color: #c7d3ef;
        }
    }
`;

/**
 * 주식 정보로 테이블을 만들어주는 훅 입니다
 * 테이블의 열을 클릭하면 해당 주식의 Detail 페이지로 이동합니다
 * @author 이중원
 * @param {Array} data 테이블을 만들 정보(배열)
 * @returns [ 랜더링을 할 html , 테이블 정보를 업데이트를 해주는 set함수 ]
 */
const useCreateTable = (data) => {
    const [Data, setData] = useState(data);
    const navigate = useNavigate();

    /** 클릭시 주식코드기준으로 주식상세페이지로 이동합니다
     * @type {[ 주식코드, 주식이름, 주식시가총액 ]} */
    const Linkhandler = (data) => {
        navigate(`/stock/${data[0]}`, { state: { name: data[1], MarketCap: data[2] } });
    };

    return [
        <Table>
            <thead>
                <tr>
                    <th>종목명</th>
                    <th>종가</th>
                    <th>등락률</th>
                    <th>시가총액</th>
                    <th>거래량 · 거래대금</th>
                </tr>
            </thead>
            <tbody>
                {Data
                    ? Data.map((el) => {
                          return (
                              <tr
                                  key={el.srtnCd}
                                  onClick={(e) => {
                                      Linkhandler([el.srtnCd, el.itmsNm, NumberToKR(el.mrktTotAmt)]);
                                  }}
                              >
                                  <td>
                                      <div>{el.itmsNm}</div>
                                      <SmFont>{el.srtnCd}</SmFont>
                                  </td>
                                  {el.fltRt > 0 ? (
                                      <td>
                                          <div className="red">{CommaGenerator(el.clpr)}</div>
                                          <SmFontContainer>
                                              <RedTriangle />
                                              <span className="red">{el.vs}</span>
                                          </SmFontContainer>
                                      </td>
                                  ) : (
                                      <td>
                                          <div className="blue">{CommaGenerator(el.clpr)}</div>
                                          <SmFontContainer>
                                              <BlueTriangle />
                                              <span className="blue">{el.vs}</span>
                                          </SmFontContainer>
                                      </td>
                                  )}
                                  <td>{el.fltRt > 0 ? <RedBox>{Number(el.fltRt)}%</RedBox> : <BlueBox>{Number(el.fltRt)}%</BlueBox>}</td>
                                  <td>{NumberToKR(el.mrktTotAmt)}</td>
                                  <td>
                                      <div>{CommaGenerator(el.trqu)}</div>
                                      <SmFont>{NumberToKR(el.trPrc)}</SmFont>
                                  </td>
                              </tr>
                          );
                      })
                    : null}
            </tbody>
        </Table>,
        setData,
    ];
};

export default useCreateTable;