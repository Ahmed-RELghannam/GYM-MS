import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chart.js/auto';
import { Navigate } from 'react-router-dom';

Chart.register(...registerables);

const HomePage = () => {
  const [cardData, setCardData] = useState({});
  const [loadingCards, setLoadingCards] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [labels, setLabels] = useState([]);
  const [chartData, setChartData] = useState([]);
  const userType = localStorage.getItem('userType');



 


  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://127.0.0.1:8000/Billing/DashbordCards/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        setCardData(response.data);
        setLoadingCards(false);
      } catch (error) {
        console.error('Error fetching card data:', error);
        setLoadingCards(false);
      }
    };

    const fetchChartData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://127.0.0.1:8000/Billing/MonthlySubscriptions/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        const subscriptionData = response.data;
        const days = Object.keys(subscriptionData).map(day => day.toString());
        const counts = Object.values(subscriptionData);

        setLabels(days);
        setChartData(counts);
        setLoadingChart(false);
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setLoadingChart(false);
      }
    };

    fetchCardData();
    fetchChartData();

    const intervalId = setInterval(() => {
      fetchCardData();
      fetchChartData();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const chartDataConfig = {
    labels,
    datasets: [
      {
        label: 'Subscriptions',
        data: chartData,
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };


  if (userType === 'Coach') {
    return <Navigate to="/test" />;
  }
 

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Welcome to the Gym Management System!</h2>
      
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h5 className="card-title">Total Amount in Cash</h5>
              <p className="card-text">{loadingCards ? 'Loading...' : `${cardData.total_cash} EGP`}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h5 className="card-title">Amount Collected Today</h5>
              <p className="card-text">{loadingCards ? 'Loading...' : `${cardData.total_today_amount} EGP`}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-info mb-3">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h5 className="card-title">Members Checked In Today</h5>
              <p className="card-text">{loadingCards ? 'Loading...' : `${cardData.Members_Checked_In_Today}`}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card text-white bg-warning mb-3">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h5 className="card-title">Total Active Subscriptions</h5>
              <p className="card-text">{loadingCards ? 'Loading...' : `${cardData.Active_subscrption}`}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card text-white bg-danger mb-3">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h5 className="card-title">Subscriptions Joined Today</h5>
              <p className="card-text">{loadingCards ? 'Loading...' : `${cardData.total_today_count}`}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Subscriptions This Month</h5>
              {loadingChart ? 'Loading chart...' : <Line data={chartDataConfig} options={options} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
