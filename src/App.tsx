import axios from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import styled from "styled-components";
import "./App.css";
import { Chart } from "./Chart";
import { devices } from "./responsive/media-queries";

const key = "wjaB4yAtWUYTi8UGg209wJdXBQGVquombJXeEa1F";

type PrefectureType = {
  result: {
    prefCode: number;
    prefName: string;
  }[];
};

type PopulationType = {
  value: number;
  year: number;
}[];

type SeriesType = {
  name: string;
  data: number[];
  categories: number[];
}[];

const InlineDiv = styled.div`
  display: inline;
  margin: 4px;
`;

const ContainerDiv = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: space-around;
  height: 100vh;
  padding: 0 5%;
  margin: 0 auto;

  @media ${devices.tablet} {
    width: 800px;
  }
`;

const PrefectureDiv = styled.div`
  width: 100%;

  @media ${devices.tablet} {
    width: 800px;
  }
`;

const PrefectureTitleDiv = styled.div`
  margin: 10px 0;
  font-family: bold;
  font-size: 36px;
`;

const ChartMessageDiv = styled.div`
  border: 2px solid lightblue;
  text-align: center;
  padding: 20px;
`;

const App = () => {
  const [prefectures, setPrefectures] = useState<PrefectureType>();
  const [series, setSeries] = useState<SeriesType>([]);

  useEffect(() => {
    axios
      .get("https://opendata.resas-portal.go.jp/api/v1/prefectures", {
        headers: { "X-API-KEY": key },
      })
      .then((results) => {
        setPrefectures(results.data);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, []);

  if (!prefectures) return <></>;

  const onChangePrefecture = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, checked, name } = e.target;
    if (checked) {
      axios
        .get(
          `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${id}`,
          {
            headers: { "X-API-KEY": key },
          }
        )
        .then((results) => {
          const populationResponse: PopulationType =
            results.data.result.data[0].data;
          const data = populationResponse.map((population) => population.value);
          const categoriesData = populationResponse.map(
            (population) => population.year
          );
          const chartData = { name, data, categories: categoriesData };

          const chartArray = [...series, chartData];
          setSeries(chartArray);
        });
    } else {
      const filterSeries = series.filter((series) => series.name !== name);
      setSeries(filterSeries);
    }
  };

  return (
    <ContainerDiv>
      <PrefectureDiv>
        <PrefectureTitleDiv>都道府県</PrefectureTitleDiv>
        {prefectures &&
          prefectures?.result.map(({ prefCode, prefName }, index) => {
            return (
              <InlineDiv key={index}>
                <input
                  type="checkbox"
                  name={prefName}
                  id={String(prefCode)}
                  onChange={(e) => onChangePrefecture(e)}
                />
                <label>{prefName}</label>
              </InlineDiv>
            );
          })}
      </PrefectureDiv>
      {!series.length ? (
        <ChartMessageDiv>
          上のチェックボックスから都道府県を選択するとグラフが表示されます。
        </ChartMessageDiv>
      ) : (
        <Chart chartData={series} />
      )}
    </ContainerDiv>
  );
};

export default App;
