import React from 'react';
import '../App.css';

class Picture extends React.Component {
    render() {
        return (
            <div>
                <button onClick={() => this.props.onClick(this.props.picture)}>
                    <img src={require(`../pics/${this.props.picture.id}.JPG`)} alt="test-img"
                        width="100" height="100"/>
                </button>
            </div>
        );
    };
}

export default Picture;
