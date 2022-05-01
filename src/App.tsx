import axios from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import styled from "styled-components";
import "./App.css";
import { Chart } from "./Chart";

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
}[];

const InlineDiv = styled.div`
  display: inline;
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
          const seriesData = { name, data };
          const seriesArray = [...series, seriesData];
          setSeries(seriesArray);
        });
    } else {
      const filterSeries = series.filter((series) => series.name !== name);
      setSeries(filterSeries);
    }
  };

  return (
    <div className="App">
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
      {!series.length ? (
        <div>
          上のチェックボックスから都道府県を選択するとグラフが表示されます。
        </div>
      ) : (
        <Chart series={series} />
      )}
    </div>
  );
};

export default App;
