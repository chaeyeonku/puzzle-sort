import React from 'react';
import '../App.css';
import Button from '@mui/material/Button';

class Picture extends React.Component {
    render() {
        return (
            <div>
                <Button 
                    className="Button" 
                    variant="outlined"
                    color="secondary"
                    onClick={() => this.props.onClick(this.props.picture)}>
                    <img src={require(`../pics/${this.props.picture.id}.JPG`)} alt="test-img"
                            width="200" height="200"/>
                </Button>
            </div>
        );
    };
}

export default Picture;
