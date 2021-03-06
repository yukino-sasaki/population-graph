import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type Props = {
  chartData?: {
    name: string;
    data: number[];
    categories: number[];
  }[];
};

export const Chart: React.FC<Props> = ({ chartData }) => {
  const series = chartData?.map(({ name, data }) => {
    return { name, data };
  });
  const categories = chartData?.map(({ categories }) => categories).flat();

  const options = {
    title: {
      text: "各都道府県の総人口推移",
      style: {
        fontWeight: "bold",
      },
    },
    yAxis: {
      title: {
        text: "人口(人)",
      },
    },
    xAxis: {
      title: {
        text: "年",
      },
      categories,
    },

    series,

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 800,
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
};
