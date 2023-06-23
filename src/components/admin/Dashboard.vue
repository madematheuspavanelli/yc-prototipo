<template>
  <div class="dashboard">
    <h1>{{ $t("message.dashboard") }}</h1>
    <div class="cards">
      <b-card no-body bg-variant="dark" v-for="card in cards" :key="card.id">
        <span class="value">{{ card.value }}</span>
        <span class="title">{{ $t(card.title) }}</span>
      </b-card>
    </div>
    <b-card no-body bg-variant="dark" class="chart-card">
      <h2>{{ $t("message.reservationList") }}</h2>
      <div class="chart-container">
        <canvas ref="chart"></canvas>
      </div>
    </b-card>
    <transition name="fade">
      <app-loader v-if="isLoading" :isAdmin="true" />
    </transition>
  </div>
</template>

<script>
import Chart from "chart.js";

export default {
  name: "Dashboard",
  data() {
    return {
      chartData: {},
      cards: [
        {
          id: 1,
          value: 0,
          title: "message.preCheckinQuantity"
        },
        {
          id: 2,
          value: 0,
          title: "message.checkinsMade"
        },
        {
          id: 3,
          value: 0,
          title: "message.pendingCheckouts"
        },
        {
          id: 4,
          value: 0,
          title: "message.checkoutsMade"
        },
        {
          id: 5,
          value: 0,
          title: "message.registeredGuests"
        }
      ],
      isLoading: true
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.isLoading = true;
      this.$API.admin
        .dashboard()
        .then(data => {
          this.cards[0].value = (data.info || {}).totalPreCheckins || 0;
          this.cards[1].value = (data.info || {}).totalCheckins || 0;
          this.cards[2].value = (data.info || {}).totalPendingCheckouts || 0;
          this.cards[3].value = (data.info || {}).totalCheckouts || 0;
          this.cards[4].value = (data.info || {}).totalGuests || 0;
          this.chartData = data.chartData || {};
          this.plotChart();
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    plotChart() {
      Chart.defaults.global.defaultFontColor = "#ffffff";
      Chart.defaults.global.legend.position = "bottom";
      Chart.defaults.global.maintainAspectRatio = false;
      // get line chart canvas
      const element = this.$refs.chart.getContext("2d");

      const gradientFillYellow = element.createLinearGradient(0, 0, 0, 500);
      gradientFillYellow.addColorStop(0, "rgba(255, 212, 0, 0.4)");
      gradientFillYellow.addColorStop(0.5, "rgba(255, 212, 0, 0.2)");
      gradientFillYellow.addColorStop(1, "rgba(255, 212, 0, 0.1)");

      const gradientFillGray = element.createLinearGradient(0, 0, 0, 500);
      gradientFillGray.addColorStop(0, "rgba(158, 158, 158, 0.4)");
      gradientFillGray.addColorStop(0.5, "rgba(158, 158, 158, 0.2)");
      gradientFillGray.addColorStop(1, "rgba(158, 158, 158, 0.1)");

      var statusChartObject = {
        type: "line",
        data: {
          datasets: [
            {
              label: this.$t("message.checkinsMade"),
              backgroundColor: gradientFillYellow,
              borderColor: "#FFD400",
              fill: true,
              data: this.parseData(this.chartData.checkins || []),
              borderWidth: 2,
              pointBorderWidth: 2,
              pointHoverBorderWidth: 2,
              pointBackgroundColor: "#FFD400",
              pointRadius: 2,
              pointHoverRadius: 8,
              pointHitRadius: 4
            },
            {
              label: this.$t("message.checkoutsMade"),
              backgroundColor: gradientFillGray,
              borderColor: "#9e9e9e",
              fill: true,
              data: this.parseData(this.chartData.checkout || []),
              borderWidth: 2,
              pointHoverBorderWidth: 2,
              pointBorderWidth: 2,
              pointBackgroundColor: "#9e9e9e",
              pointRadius: 2,
              pointHoverRadius: 8,
              pointHitRadius: 4
            }
          ],
          labels: this.getLabels() || []
        },
        options: {
          scales: {
            xAxes: [
              {
                scaleLabel: {
                  display: false
                },
                gridLines: {
                  // display: false
                  zeroLineColor: "#4e5c5c",
                  color: "#5c5c5c",
                  drawTicks: false
                },
                ticks: {
                  callback: value => {
                    return this.$d(new Date(value), "short");
                  },
                  padding: 20
                }
              }
            ],
            yAxes: [
              {
                scaleLabel: {
                  display: false
                },
                gridLines: {
                  zeroLineColor: "#5c5c5c",
                  color: "#5c5c5c",
                  drawTicks: false
                  // display: false
                },
                ticks: {
                  precision: 0,
                  padding: 20
                }
              }
            ]
          },
          title: {
            display: false
          },
          legend: {
            display: true,
            fontSize: 18
          },
          tooltips: {
            callbacks: {
              title: tooltipItem => {
                return this.$d(new Date(tooltipItem[0].label), "short");
              }
            },
            mode: "index",
            position: "nearest"
          }
        }
      };

      // draw line chart
      new Chart(element, {
        type: statusChartObject.type,
        data: statusChartObject.data,
        options: statusChartObject.options
      });

      this.isLoading = false;
    },
    parseData(data) {
      return data.map(item => item.amount);
    },
    getLabels() {
      const targetList =
        (this.chartData.checkins || []).length > (this.chartData.checkout || []).length
          ? this.chartData.checkins
          : this.chartData.checkouts;
      return (targetList || []).map(item => item.date);
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  h1 {
    color: $white;
    margin: 20px 0;
  }

  .cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .card {
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      margin-bottom: 20px;
      text-align: center;

      span {
        color: $white;
      }

      .value {
        font-size: 30px;
      }

      .title {
        font-size: 15px;
      }
    }
  }

  .chart-card {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    margin-bottom: 40px;
    padding: 30px 40px 20px 40px;

    h2 {
      color: $white;
      margin-bottom: 20px;
    }

    .chart-container {
      position: relative;
      flex-grow: 1;
      width: 100%;
      min-height: 300px;
      height: 300px;
      max-height: 300px;
    }
  }
}

@media screen and (min-width: 575px) {
  .dashboard {
    .cards {
      .card {
        margin-right: 20px;
        width: calc((100% - 20px) / 2);

        &:last-child {
          margin-right: 0;
        }

        &:nth-child(2n) {
          margin-right: 0;
        }
      }
    }
  }
}

@media screen and (min-width: 768px) {
  .dashboard {
    .cards {
      .card {
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 20px;
        width: calc((100% - 40px) / 3);
        text-align: center;
        margin-bottom: 20px;

        &:nth-child(2n) {
          margin-right: 20px;
        }

        &:nth-child(3n) {
          margin-right: 0;
        }
      }
    }
  }
}

@media screen and (min-width: 1200px) {
  .dashboard {
    max-height: 100%;
    overflow: hidden;

    .cards {
      .card {
        width: calc((100% - 80px) / 5);

        &:nth-child(3n) {
          margin-right: 20px;
        }
      }
    }
    .chart-card {
      .chart-container {
        flex-grow: 1;
        max-height: unset;
      }
    }
  }
}
</style>
