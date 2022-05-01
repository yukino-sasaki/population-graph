import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type Props = {
  series?: {
    name: string;
    data: number[];
  }[];
};

export const Chart: React.FC<Props> = ({ series }) => {
  const options = {
    title: {
      text: "prefecture population chart",
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
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },

    accessibility: {
      enabled: false,
    },

    series,

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
        pointStart: 1960,
      },
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
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
