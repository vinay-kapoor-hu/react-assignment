import React, { useRef } from 'react';
import './App.css';
import axios from 'axios';
import $ from 'jquery'; 


class App extends React.Component {
  state = {
    category_list: [],
    selected_category_index: null,
    selected_category_id: null,
    selected_category_products: [],
    loading_products: false,
    show_complete_list: false
  }

  loadCategoriesListAndFirstCategoryProducts = () => {
    let headers = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    };
    let params = {};
    let url = 'https://backend.ustraa.com/rest/V1/api/homemenucategories/v1.0.1?device_type=mob';
    try {
      axios.get(url, {headers: headers.headers, params: params}).then((response) => {
        this.setState({
          category_list: response.data.category_list,
          selected_category_index: 0,
          selected_category_id: response.data.category_list[0].category_id,
          selected_category_products: response.data.product_list.products
        });
      }, (error) => {
        console.log(error)
      });
    } catch (error) {
      console.log(error);
    }
  }

  loadCategoryProduct = (id) => {
    let headers = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }      
    };
    let params = {category_id: id};
    let url = 'https://backend.ustraa.com/rest/V1/api/catalog/v1.0.1';
    try {
      axios.get(url, {headers: headers.headers, params: params}).then((response) => {
        this.setState({
          selected_category_products: response.data.products,
          loading_products: false
        });
      }, (error) => {
        console.log(error)
      });
    } catch (error) {
      console.log(error);
    }
  }

  changeCategory = (id, index) => {
    if (id != this.state.selected_category_id) {
      $(".category_slider").animate({scrollLeft: index*125}, 200);;
      this.setState({
        selected_category_id: id, 
        selected_category_index: index, 
        selected_category_products: [], 
        loading_products: true,
        show_complete_list: false
      });
      this.loadCategoryProduct(id);
    }
  }

  componentWillMount() {
    this.loadCategoriesListAndFirstCategoryProducts();
  }
  toggleViewList = () => {
    this.setState({show_complete_list: !this.state.show_complete_list});
  }
  render() {
    let selectedListView = (this.state.show_complete_list) ? this.state.selected_category_products : this.state.selected_category_products.slice(0, 3);
    return (
      <div className="App">
        <div className="App-Center">
          <div className="category_slider">
            {this.state.category_list.map((value, index) => {
              let styled = {
                backgroundImage: "url('"+ value.category_image +"')",
                backgroundSize: "cover",
                backgroundPosition: "center"
              };
              if (this.state.selected_category_id == value.category_id) {
                styled.fontWeight = 'bolder';
              }
              let ref = React.createRef();
              // let ref = useRef(null);
              let id = value.category_id;
              return (
                <div key={index} className="category_object" onClick={() => this.changeCategory(id, index)}>
                  <div className="category_content" style={styled}>{value.category_name}</div>
                </div>
              );
            })}
          </div>
          <div className="products_list">
            {(!this.state.loading_products && this.state.selected_category_products) ? 
              (selectedListView.map((value, index) => {
                return (
                  <div className="product_object">
                    <div className="product_image"><img src={value.image_urls.x300} /></div>
                    <div className="product_detail">
                      <div className="product_name"><p>{value.name}</p></div>
                      <div className="product_weight"><p>({value.weight} {value.weight_unit})</p></div>
                      <div className="product_amount">{(value.price != value.final_price) ? <p>&#8377; {value.final_price}<small><s>&#8377; {value.price}</s></small></p> : <p>&#8377; {value.price}</p> }</div>
                      <div className="product_action">{(value.is_in_stock) ? <button>ADD TO CART</button> : <button className="out_of_stock">OUT OF STOCK</button>}</div>
                    </div>
                    <div className="product_rating">
                      <p>4 <svg viewBox="0 0 24 24" className="rate_star"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg></p>
                    </div>
                  </div>
                );
              }))
                
              : <div style={{marginTop: '50px'}}>Loading Produts.....</div>
            }
                
          </div>
          {(!this.state.loading_products) ? 
            <div className="bottom_product">
              <div className="showing_for"><p><small>Showing for</small> {(this.state.category_list[this.state.selected_category_index]) ? this.state.category_list[this.state.selected_category_index].category_name : ''}</p></div>
              <div className="view_toggle" onClick={() => this.toggleViewList()}>
                {(this.state.show_complete_list) ? "[-] View less" : "[+] View more"}
              </div>
            </div>
            : ''
          }
        </div>
      </div>
    );
  }
}

export default App;
