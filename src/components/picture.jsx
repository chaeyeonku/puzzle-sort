import React from 'react';
import '../App.css';

class Picture extends React.Component {
    render() {
        return (
            <div>
                <button className="picOptionBtn"
                    onClick={() => this.props.onClick(this.props.picture)}>
                    <img src={require(`../pics/${this.props.picture.id}.JPG`)} alt="test-img"
                        width="130" height="130"/>
                </button>
            </div>
        );
    };
}

export default Picture;
