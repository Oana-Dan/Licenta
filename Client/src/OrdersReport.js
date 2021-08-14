import React from 'react';
import Navbar from './NavbarComp';
import ProductStore from './ProductStore';
import UserStore from './UserStore';
import { Chart } from 'primereact/chart';

class Report extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chartData: {}
        }

    }

    componentWillMount() {
        ProductStore.getDaysOfWeeks().then(days => {
            let last7Days = days.slice(-7);
            for (let i = 0; i < last7Days.length; i++) {
                last7Days[i].counter = 0;
            }
            UserStore.getUsers().then(users => {
                for (let i = 0; i < users.length; i++) {
                    for (let j = 0; j < last7Days.length; j++) {
                        UserStore.getOrders(users[i].email).then((orders) => {
                            for (let k = 0; k < orders.length; k++) {
                                if (orders[k].data === last7Days[j].data) {
                                    last7Days[j].counter += 1;
                                }
                            }
                            let orderNumbers = [];
                            for (let l = 0; l < last7Days.length; l++) {
                                orderNumbers.push(last7Days[l].counter);
                            }
                            let labels = [];
                            for (let l = 0; l < last7Days.length; l++) {
                                labels.push(last7Days[l].data);
                            }
                            let chartData = {
                                labels: labels,
                                datasets: [
                                    {
                                        label: 'Numar comenzi',
                                        backgroundColor: '#42A5F5',
                                        data: orderNumbers
                                    }
                                ]
                            };
                            this.setState({ chartData: chartData });
                        })
                    }
                }
            })
        })
    }

    render() {
        let basicOptions = {
            maintainAspectRatio: false,
            aspectRatio: .8,
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };
        return (
            <div>
                <Navbar searchBar={true} />
                <Chart type="bar" data={this.state.chartData} options={basicOptions} />
            </div>
        )
    }
}

export default Report;