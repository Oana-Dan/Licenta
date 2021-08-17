import React from 'react';
import Navbar from './NavbarComp';
import ProductStore from './ProductStore';
import { Chart } from 'primereact/chart';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

class ProductsReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chartData: {},
            value: ''
        }

        this.searchProducts = () => {
            if (this.state.value) {
                ProductStore.getProducts().then((products) => {
                    for (let i = 0; i < products.length; i++) {
                        ProductStore.getDayWeekOrderedProduct(this.state.value, products[i].nume).then((weekOrderedProduct) => {
                            if (weekOrderedProduct.message === "not found") {
                                products[i].cantitate = 0;
                            }
                            else {
                                products[i].cantitate = weekOrderedProduct.cantitate;
                            }
                            let productsQuantity = [];
                            for (let j = 0; j < products.length; j++) {
                                productsQuantity.push(products[j].cantitate);
                            }
                            let labels = [];
                            for (let l = 0; l < products.length; l++) {
                                labels.push(products[l].nume);
                            }
                            let chartData2 = {
                                labels: labels,
                                datasets: [
                                    {
                                        label: `Numar produse comandate in data de ${this.state.value}`,
                                        backgroundColor: '#42A5F5',
                                        data: productsQuantity
                                    }
                                ]
                            };
                            this.setState({ chartData2: chartData2 });
                        })
                    }
                })
            }
        }
    }

    componentWillMount() {
        let date = new Date();
        let finalDate = "";
        if (date.getDate() <= 9) {
            finalDate += "0" + date.getDate() + "-";
        }
        else {
            finalDate += date.getDate() + "-";
        }
        if ((date.getMonth() + 1) <= 9) {
            finalDate += "0" + (date.getMonth() + 1) + "-";
        }
        else {
            finalDate += date.getMonth() + "-";
        }
        finalDate += date.getFullYear();
        this.setState({ value: finalDate });
        ProductStore.getProducts().then((products) => {
            for (let i = 0; i < products.length; i++) {
                ProductStore.getDayWeekOrderedProduct(finalDate, products[i].nume).then((weekOrderedProduct) => {
                    if (weekOrderedProduct.message === "not found") {
                        products[i].cantitate = 0;
                    }
                    else {
                        products[i].cantitate = weekOrderedProduct.cantitate;
                    }
                    let productsQuantity = [];
                    for (let j = 0; j < products.length; j++) {
                        productsQuantity.push(products[j].cantitate);
                    }
                    let labels = [];
                    for (let l = 0; l < products.length; l++) {
                        labels.push(products[l].nume);
                    }
                    let chartData2 = {
                        labels: labels,
                        datasets: [
                            {
                                label: `Numar produse comandate in data de ${finalDate}`,
                                backgroundColor: '#42A5F5',
                                data: productsQuantity
                            }
                        ]
                    };
                    this.setState({ chartData2: chartData2 });
                })
            }
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
        let horizontalOptions = {
            indexAxis: 'y',
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
                <span className="centerInputText">
                    <div className="outer">
                        <div className="inner">
                            <InputText value={this.state.value} onChange={(evt) => this.setState({ value: evt.target.value })} placeholder="dd-mm-yyyy" />
                        </div>
                        <div className="inner">
                            <Button style={{ marginLeft: "-1.7vw", marginBottom: "-1vh" }} icon="pi pi-arrow-right" className="p-button-raised p-button-text" onClick={this.searchProducts} />
                        </div>
                    </div>
                </span>
                <Chart type="bar" data={this.state.chartData2} options={basicOptions} />
            </div>
        )
    }
}

export default ProductsReport;