import React, { Component, createContext } from 'react';
import { Persist } from 'react-persist';
require('dotenv').config(); 

export const FinanceContext = createContext(); 


class FinanceContextProvider extends Component { 
    constructor(props) {
        super(props);
        const AbortController = window.AbortController;
        this.controller = new AbortController();
        this.signal = this.controller.signal;
        this.state = { 
            stocks: [], 
            mostActive: [], 
            mostPopular: [], 
            mostLoser: [], 
            name: "", 
            tempStock: [], 
            stockChart: [], 
            tempActive: [], 
            mostActiveChart: [], 
            tempPopular: [], 
            mostPopularChart: [], 
            tempLoser: [], 
            mostLoserChart: [], 
            details: [], 
            detailsChart: [], 
            search: [], 
            searchCompany: [], 
            searchResults: [],
            portfolio: [], 
            activeIndex: 3, 
            isTablet: false, 
            user: null, 
            news: [], 
            visible: 10, 
            isMarketOpen: false,
        }
    } 

    componentDidMount() { 
        this.clearState(); 
        this.updateProps();
        this.getStocks();
        this.getActive(); 
        this.getPopular(); 
        this.getLoser(); 
        this.getWorkingHours(); 


        window.addEventListener("resize", this.updateProps);
    }


    componentDidUpdate(prevProps, prevState) { 
        if(prevState.portfolio !== this.state.portfolio)  { 
            this.setState({ news: [] }, () => { 
                this.getNewsProfile(); 
            })
        }
    }


    componentWillUnmount() { 
        window.removeEventListener("resize", this.updateProps);
        this.controller.abort(); 
    }

    updateProps = () => { 
        this.setState({ 
            isTablet: window.innerWidth > 768
        })
    }

    clearState = () => { 
        this.setState({
            search: [], 
            searchResults: [], 
            searchCompany: [], 
            activeIndex: 3, 
            visible: 10
        })
    }

    abortFunc = (error) => { 
        if(error.name === "AbortError") { 
            console.log("fetch aborted");
        } else { 
            console.log(error.message);
        }
    }

    getStocks = async () => { 
        const signal = this.signal;
        try { 
            const response = await fetch(
                "https://financialmodelingprep.com/api/v3/quote/AAPL,FB,TSLA,MSFT,GOOG",
                { signal }
            )
            const data = await response.json(); 
            this.setState({ 
                stocks: data, 
            }, 
            () => { 
                this.getStockCharts();
            }
            ) 
        } catch (err) { 
            this.abortFunc(err);
        }
    }

    getActive = async () => { 
        const signal = this.signal; 
        try { 
            const response = await fetch(
                "https://financialmodelingprep.com/api/v3/stock/actives",
                { signal }
            )

            const data = await response.json(); 
            this.setState({ 
                mostActive: data.mostActiveStock
            }, 
            () => { 
                this.getActiveCharts(); 
            })
        } catch(err) { 
            this.abortFunc(err);
        }
    }

    getPopular = async () => { 
        const signal = this.signal; 
        try { 
            const response = await fetch(
                "https://financialmodelingprep.com/api/v3/stock/gainers",
                { signal }
            )

            const data = await response.json(); 
            this.setState({ 
                mostPopular: data.mostGainerStocks
            }, 
            () => { 
                this.getPopularCharts(); 
            })
        } catch(err) { 
            this.abortFunc(err);
        }        
    }

    getLoser = async () => { 
        const signal = this.signal; 
        try { 
            const response = await fetch(
                "https://financialmodelingprep.com/api/v3/stock/losers",
                { signal }
            )

            const data = await response.json(); 
            this.setState({ 
                mostLoser: data.mostLoserStock,
            }, 
            () => { 
                this.getLoserCharts(); 
            })
        } catch(err) { 
            this.abortFunc(err);
        }                
    }


    getStockCharts = () => { 
        const signal = this.signal; 
        try { 
            if(this.state.stocks.length > 4) { 
                this.state.stocks.map(async (stock, index) => { 
                    const response = await fetch(
                        `https://financialmodelingprep.com/api/v3/historical-chart/1hour/${stock.symbol}`,
                        { signal }
                    )
                    const data = await response.json(); 
                    this.setState({ 
                        tempStock: [...this.state.tempStock, [data, index]],
                    })
                    let newState = [...this.state.tempStock];
                    newState = newState.sort((a, b) => a[1] - b[1]).map(stock => stock.slice(0, 1)).flat(1)
                    this.setState({ 
                        stockChart: newState,
                    })
                } )
            }
        } catch (err) {
            this.abortFunc(err);
        } 
        
    }



    getActiveCharts = () => {
        const signal = this.signal;
        try {
          this.state.mostActive.map(async (stock, index) => {
            const response = await fetch(
              `https://financialmodelingprep.com/api/v3/historical-chart/1hour/${stock.ticker}`,
              { signal }
            );
            const data = await response.json();
            this.setState({
              tempActive: [...this.state.tempActive, [data, index]],
            });
            let newState = [...this.state.tempActive];
            newState = newState
              .sort((a, b) => a[1] - b[1])
              .map((stock) => stock.slice(0, 1))
              .flat(1);
            this.setState({
              mostActiveChart: newState,
            });
          });
        } catch (error) {
          this.abortFunc(error);
        }
      };
    
      getPopularCharts = () => {
        const signal = this.signal;
        try {
          this.state.mostGainer.map(async (stock, index) => {
            const response = await fetch(
              `https://financialmodelingprep.com/api/v3/historical-chart/1hour/${stock.ticker}`,
              { signal }
            );
            const data = await response.json();
            this.setState({
              tempGainer: [...this.state.tempGainer, [data, index]],
            });
            let newState = [...this.state.tempGainer];
            newState = newState
              .sort((a, b) => a[1] - b[1])
              .map((stock) => stock.slice(0, 1))
              .flat(1);
            this.setState({
              mostPopularChart: newState,
            });
          });
        } catch (error) {
          this.abortFunc(error);
        }
      };
    
      getLoserCharts = () => {
        const signal = this.signal;
        try {
          this.state.mostLoser.map(async (stock, index) => {
            const response = await fetch(
              `https://financialmodelingprep.com/api/v3/historical-chart/1hour/${stock.ticker}`,
              { signal }
            );
            const data = await response.json();
            this.setState({
              tempLoser: [...this.state.tempLoser, [data, index]],
            });
            let newState = [...this.state.tempLoser];
            newState = newState
              .sort((a, b) => a[1] - b[1])
              .map((stock) => stock.slice(0, 1))
              .flat(1);
            this.setState({
              mostLoserChart: newState,
            });
          });
        } catch (error) {
          this.abortFunc(error);
        }
      };


      handleClick = (name) => { 
        this.setState( { 
            name, 
            details: [], 
            detailsChart: [], 
        })

        this.getDetails(name);
      }


      getDetails = async (name) => { 
        const signal = this.signal;
        try {
          const response = await fetch(
            `https://financialmodelingprep.com/api/v3/company/profile/${name}`,
            { signal }
          );
          const data = await response.json();
          this.setState(
            {
              details: data,
            },
            () => {
              this.getDetailsChart("1hour");
            }
          );
        } catch (error) {
          this.abortFunc(error);
        }
      }


      getDetailsChart = async (time) => { 
        const signal = this.signal; 
        try { 
            const response = await fetch( 
                `https://financialmodelingprep.com/api/v3/historical-chart/${time}/${this.state.details.symbol}`,
                { signal }
            )
            const data = await response.json(); 
            this.setState({ 
                detailsChart: [data], 
            })
        }  catch(err) { 
            this.abortFunc(err);
        }
      }


      changeIndex = (index) => { 
        this.setState({ 
            activeIndex: index
        })
      }



      searchStocks = async () => {
        const signal = this.signal;
        try {
          const response = await fetch(
            `https://financialmodelingprep.com/api/v3/search?query=${this.state.search}&limit=15`,
            { signal }
          );
          const data = await response.json();
          this.setState(
            {
              searchCompany: data,
            },
            () => {
              this.getSearchedStocks();
            }
          );
        } catch (error) {
          this.abortFunc(error);
        }
      };

      getSearchedStocks = () => {
        const signal = this.signal;
        try {
          this.state.searchCompany.map(async (stock) => {
            const response = await fetch(
              `https://financialmodelingprep.com/api/v3/quote/${stock.symbol}`,
              { signal }
            );
            const data = await response.json();
            this.setState({
              searchResults: [...this.state.searchResults, data],
            });
          });
        } catch (error) {
          this.abortFunc(error);
        }
      };

      
      handleChange = (event) => { 
        if(event.target.value.length) { 
            this.setState({
                search: [], 
                searchResults: [], 
                searchCompany: [], 
            })
        }

        this.setState({ 
            search: event.target.value, 
            searchResults: [], 
        }, 
        () => { 
            this.searchStocks(); 
        })
        
      }

      addPortfolio = (stock) => { 
        const { portfolio } = this.state;
        let copyPortfolio = [...portfolio]; 
        if(!portfolio.some((addedStock) => addedStock.symbol === stock.symbol)) { 
            copyPortfolio.push(stock);
            this.setState({ 
                portfolio: copyPortfolio, 
            })
        } else { 
            copyPortfolio = copyPortfolio.filter( 
                entry => entry.symbol !== stock.symbol
            )

            this.setState({ 
                portfolio: copyPortfolio
            })
        }
      }

      getNewsProfile = () => { 
          const signal = this.signal; 
          const { portfolio, news } = this.state; 
          try { 
              if(portfolio.length)  { 
                  portfolio.map(async (stock) => { 
                      if(stock.profile.companyName) { 
                          const response = await fetch(
                            `https://api.currentsapi.services/v1/search?keywords=${stock.profile.companyName
                            .split(" ")
                            .slice(0, 1)
                            .join(" ")}&language=en&apiKey=${
                            process.env.REACT_APP_NEWS_API_KEY
                          }`,
                          { signal }
                          )

                          const data = await response.json(); 
                          this.setState({ 
                              news: [...news, data.news]
                          })
                      } else { 
                          const response = await fetch(
                            `https://api.currentsapi.services/v1/search?keywords=${stock.symbol}&language=en&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`,
                            { signal }
                          )
                          const data = await response.json(); 
                          this.setState({ 
                              news: [...news, data.news]
                          })
                      }
                  })
              } else { 
                  this.setState({ 
                      news: [], 
                  })
              }
          } catch (err) { 
              this.abortFunc(err);
          }
      }


      loadMore = () => { 
          this.setState(prev => {
              return { visible: prev.visible + 10 }
          })
      }

      getWorkingHours = async () => { 
        const signal = this.signal; 
        try { 
            const response = await fetch(
                "https://financialmodelingprep.com/api/v3/is-the-market-open",
                { signal }
            );
            const data = response.json(); 
            this.setState({ 
                isMarketOpen: data.isTheStockMarketOpen,
            })
        } catch (err) {
            this.abortFunc(err);
        }
      }


      render() { 
          return (
              <FinanceContext.Provider
                value ={ {
                    ...this.state, 
                    handleClick: this.handleClick, 
                    handleChange: this.handleChange, 
                    clearState: this.clearState, 
                    addPortfolio: this.addPortfolio, 
                    getDetailsChart: this.getDetailsChart, 
                    changeIndex: this.changeIndex, 
                    getNewsProfile: this.getNewsProfile, 
                    loadMore: this.loadMore, 
                }}>
                    {this.props.children}   
                    <Persist  name="Stocks" data={this.state.portfolio} debounce={500} onMount={data => this.setState({ portfolio: data })}/>

              </FinanceContext.Provider>
          )
      }
}


export default FinanceContextProvider