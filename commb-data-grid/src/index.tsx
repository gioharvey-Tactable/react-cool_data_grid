import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { classList, Animation, createElement, closest, isNullOrUndefined } from '@syncfusion/ej2-base';
import { GridComponent, ColumnsDirective, ColumnDirective,Filter, IFilter,Inject,Grid, VirtualScroll, Sort,SelectionType, Selection  } from '@syncfusion/ej2-react-grids';
import {DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { CheckBox  } from '@syncfusion/ej2-react-buttons';
import { SampleBase } from './sample-base';
import { Slider } from '@syncfusion/ej2-react-inputs';
import { Query, DataManager, Predicate } from '@syncfusion/ej2-data';

// The Data
import { getData } from './data';

// Interface
import { ILoc, IDataNavigate } from './interfaces/data-grid_interface'

// CSS
import './index.css';

const statusTemplate = (props:any): any => {
    return (
        <div id="status" className="statustemp">
            <span className="statustxt">{props.Status}</span>
        </div>
    )
}

const ratingTemplate = (props:any): any => {
    return (
            <div className="rating">
            <span className="star"></span>
            <span className="star"></span>
            <span className="star"></span>
            <span className="star"></span>
            <span className="star"></span>
            </div>
        );
}

const progessTemplate = (props:any): any => {
    return (
            <div id="myProgress" className="pbar">
            <div id="myBar" className="bar">
                <div id="label" className="barlabel"></div>
            </div>
            </div>
            );
}

let loc = { width: '31px' , height: '24px'};

const trustTemplate = (props:any): any => {
    var Trustworthiness = props.Trustworthiness == "Sufficient" ? 'https://ej2.syncfusion.com/react/demos/src/grid/images/Sufficient.png' : props.Trustworthiness == "Insufficient" ? 'src/grid/images/Insufficient.png' : 'src/grid/images/Perfect.png';
    return (
        <> 
            <img style={loc} src={Trustworthiness}/>
            <span id="Trusttext">{props.Trustworthiness}</span>
        </>);
}

const empTemplate = (props:any): any => {
    return (<div>
      <div className="empimg">
        <span className="e-userimg">
        </span>
      </div> 
      <span id="Emptext">{props.Employees}</span>
    </div>);
}

const coltemplate = (props:any): any => {
    return (
        <div className="Mapimage"><img src="https://ej2.syncfusion.com/react/demos/src/grid/images/Map.png" className="e-image"/> <span>  </span> 
            <span id="locationtext">{props.Location}</span>
        </div>
        );
}

const trustdetails = (props:any): any => {
    if (props.Trustworthiness === "Select All") {
        return <span></span>
    }

    let loc:ILoc = { width: '31px', height: '24px' };

    let Trustworthiness:string = props.Trustworthiness == "Sufficient" ? 'https://ej2.syncfusion.com/react/demos/src/grid/images/Sufficient.png' : props.Trustworthiness == "Insufficient" ? 'src/grid/images/Insufficient.png' : 'src/grid/images/Perfect.png';
    return (
            <>
                <img style={loc} src={Trustworthiness}/> 
                <span id="Trusttext">{props.Trustworthiness}</span>
            </>
            );
}

const ratingDetails = (props:any): any => {
    let ele:JSX.Element[] = [];
    for (var i = 0; i < 5; i++) {
        if (i < props.Rating) {
            ele.push(<span className="star checked"></span>);
        }
        else {
            ele.push(<span className="star"></span>);
        }
    }
    return <div className="rating">{ele}</div>;
}

const statusdetails = (props:any): any => {
    if (props.Status === "Select All") {
        return (<span>Select All</span>);
    }
    if (props.Status === "Active") {
        return (<div className="statustemp e-activecolor">
                <span className="statustxt e-activecolor">Active</span>
            </div>);
    }
    if (props.Status === "Inactive") {
        return (<div className="statustemp e-inactivecolor">
          <span className="statustxt e-inactivecolor">Inactive</span>
          </div>);
    }
}

export class OverView extends SampleBase { 

  /* Will need to rewrite in Function Based Component */

  public dReady: boolean = false;
  private dtTime: boolean = false;
  private isDataBound: boolean = false;
  public isDataChanged: boolean = true;

  private intervalFun: any;
  private clrIntervalFun: any;
  private clrIntervalFun1: any;
  private clrIntervalFun2: any;

  public dropSlectedIndex: null | number = null;
  public ddObj: DropDownListComponent;
  public gridInstance: GridComponent;

  public stTime: any; 

  private ddlData: IDataNavigate[] = [
    { text: '1,000 Rows and 11 Columns', value: '1000' },
    { text: '10,000 Rows and 11 Columns', value: '10000' },
    { text: '1,00,000 Rows and 11 Columns', value: '100000' }      
  ];
 
  private fields: IDataNavigate = { text: 'text', value: 'value' };
 
  public onQueryCellInfo(args:any): void {
       if (args.column.field === 'Employees') {
            if (args.data.EmployeeImg === 'usermale') {
                args.cell.querySelector('.e-userimg').classList.add("sf-icon-Male");
            } else {
                args.cell.querySelector('.e-userimg').classList.add("sf-icon-FeMale");
            }
        }
        if (args.column.field === 'Status') {
            if (args.cell.textContent === "Active") {
                args.cell.querySelector(".statustxt").classList.add("e-activecolor");
                args.cell.querySelector(".statustemp").classList.add("e-activecolor");
            }
            if (args.cell.textContent === "Inactive") {
                args.cell.querySelector(".statustxt").classList.add("e-inactivecolor");
                args.cell.querySelector(".statustemp").classList.add("e-inactivecolor");
            }
        }
        if (args.column.field === 'Rating') {
            if (args.column.field === 'Rating') {
                for (var i = 0; i < args.data.Rating; i++) {
                    args.cell.querySelectorAll("span")[i].classList.add("checked");
                }
            }
        }
        if (args.column.field === "Software") {
            if (args.data.Software <= 20) {
                args.data.Software = args.data.Software + 30;
            }
            args.cell.querySelector(".bar").style.width = args.data.Software + "%";
            args.cell.querySelector(".barlabel").textContent = args.data.Software + "%";           
            if (args.data.Status === "Inactive") {
                args.cell.querySelector(".bar").classList.add("progressdisable");
            }
        }    
  }

  public onDataBound(): void {
    clearTimeout(this.clrIntervalFun);
    clearInterval(this.intervalFun);
    this.dtTime = true;
  }

  public onComplete(args:any): void{
    if (args.requestType === "filterchoicerequest") {
        if (args.filterModel.options.field === "Trustworthiness" || args.filterModel.options.field === "Rating" || args.filterModel.options.field === "Status") {
            var span = args.filterModel.dialogObj.element.querySelectorAll('.e-selectall')[0];
            if(!isNullOrUndefined(span)) {
                closest(span, '.e-ftrchk').classList.add("e-hide");
            }
        }
    }
  } 

  public getTradeData: Object = getData(1000); 

  public onChange(): void {

	this.ddObj.hidePopup();
    this.gridInstance.showSpinner();
    this.dropSlectedIndex = null;
    let index: number = this.ddObj.value as number;
    clearTimeout(this.clrIntervalFun2);

    this.clrIntervalFun2 = setTimeout(() => {
        this.isDataChanged = true;
        this.stTime = null;
        let contentElement: Element = this.gridInstance.contentModule.getPanel().firstChild as Element;
        contentElement.scrollLeft = 0;
        contentElement.scrollTop = 0;
        this.gridInstance.pageSettings.currentPage = 1;
        this.stTime = performance.now();
        this.gridInstance.dataSource = getData(index);
        this.gridInstance.hideSpinner();
    }, 100);
  }

  public check : IFilter = {
    type: 'CheckBox'
  }

  public select : any = {
      persistSelection: true,
      type: "Multiple",
      checkboxOnly: true
  }

  public onLoad(args:any): void { 
      let overview_grid:any = document.getElementById('overviewgrid')
      overview_grid.ej2_instances[0].on('data-ready', ()=> {
            this.dReady = true; 
            this.stTime = performance.now();
        });
        
    overview_grid.addEventListener('DOMSubtreeModified', () => {
    if (this.dReady && this.stTime && this.isDataChanged) {
        let msgEle:any = document.getElementById('msg');
        console.log(msgEle)
        let val: any = (performance.now() - this.stTime).toFixed(0);
        this.stTime = null;
        this.dReady = false;
        this.dtTime = false;
        this.isDataChanged = false;
        msgEle.innerHTML = 'Load Time: ' + "<b>" + val + "</b>" + '<b>ms</b>';
        msgEle.classList.remove('e-hide')
    }
    })
}

  public Filter : any = {
    type: 'Menu'
  }   

  public status : any = {
    type: 'CheckBox',
    itemTemplate: statusdetails
  }    

  public trust : any = {
    type: 'CheckBox',
    itemTemplate: trustdetails
  }   

  public rating : any = {
    type: 'CheckBox',
    itemTemplate: ratingDetails
  }    

  render() {    
    return (
      <div className='control-pane'>
        <div className='control-section'>
        <div>
            <DropDownListComponent id="games" width='220' dataSource={this.ddlData} index={0} ref={(dropdownlist:any) => { this.ddObj = dropdownlist }} fields={this.fields} change={this.onChange.bind(this)} placeholder="Select a Data Range" popupHeight="240px" />
            <span id='msg'></span>
            <br/>
        </div>
          <GridComponent id="overviewgrid" dataSource={this.getTradeData} enableHover={false} enableVirtualization={true} rowHeight={38} height='600' ref={(g:any) => { this.gridInstance = g }} actionComplete={this.onComplete.bind(this)} load={this.onLoad.bind(this)} queryCellInfo={this.onQueryCellInfo.bind(this)} dataBound={this.onDataBound.bind(this)} filterSettings={this.Filter} allowFiltering={true} allowSorting={true} allowSelection={true} selectionSettings={this.select} >
            <ColumnsDirective>
            <ColumnDirective type='checkbox' allowSorting={false} allowFiltering={false}  width='60'></ColumnDirective>
              <ColumnDirective field='EmployeeID' visible={false} headerText='Employee ID' isPrimaryKey={true} width='130'></ColumnDirective>
              <ColumnDirective field='Employees' headerText='Employee Name' width='230'clipMode='EllipsisWithTooltip' template={empTemplate} filter={this.check} />
              <ColumnDirective field='Designation'  headerText='Designation' width='170' filter={this.check} clipMode='EllipsisWithTooltip' />
              <ColumnDirective field='Mail' headerText='Mail' filter={this.Filter} width='230'></ColumnDirective>
              <ColumnDirective field='Location' headerText='Location' width='140' filter={this.check} template={coltemplate}></ColumnDirective>
              <ColumnDirective field='Status' headerText='Status' filter={this.status}  template={statusTemplate} width='130'></ColumnDirective>
              <ColumnDirective field='Trustworthiness' filter={this.trust} headerText='Trustworthiness' template={trustTemplate} width='160'></ColumnDirective>
              <ColumnDirective field='Rating' headerText='Rating' filter={this.rating}  template={ratingTemplate} width='160' />
              <ColumnDirective field='Software' allowFiltering={false} allowSorting={false} headerText='Software Proficiency' width='180' template={progessTemplate} format='C2' />
              <ColumnDirective field='CurrentSalary' headerText='Current Salary' filter={this.Filter} width='160' format='C2'></ColumnDirective>
              <ColumnDirective field='Address' headerText='Address' width='240' filter={this.Filter} clipMode="EllipsisWithTooltip" ></ColumnDirective>
            </ColumnsDirective>
            <Inject services={[Filter,VirtualScroll,Sort]} />
          </GridComponent>
        </div>  
        <style>
            @import 'src/grid/Grid/style.css';
        </style>

</div>
    )
  }
}

ReactDOM.render(<OverView />, document.getElementById('data-grid'));