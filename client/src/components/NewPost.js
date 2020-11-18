import React from 'react';
import queries from '../queries';
import { useMutation } from '@apollo/client';
import { Col,Row,Container,Form } from 'react-bootstrap';

const NewPost = () => {
    const [uploadPost] = useMutation(queries.ADD_IMAGE);

    let url;
    let posterName;
    let description;
    return (
        <div>
            <Container>
                <Row>
                    <Col>
                
            <Form
                onSubmit={() => {
                    uploadPost({
                        variables: {
                            url: url.value,
                            posterName: posterName.value,
                            description: description.value,
                        },
                    });
                    url = '';
                    posterName = '';
                    description = '';
                    alert('Post Added');
                }}
            >
                <Form.Label>
                    URL:
                    <br />
                    <input ref={(node) => url=node} required autoFocus/>
                </Form.Label>
                <br />
                <Form.Label>
                    PosterName:
                    <br />
                    <input ref={(node) => posterName=node}/>
                </Form.Label>
                <br />
                <Form.Label>
                    Description:
                    <br />
                    <input ref={(node) => description=node}/>
                </Form.Label>
                <br />
                <button type="submit">Submit</button>
            </Form>
            </Col>
            </Row>
            </Container>
        </div>
    );
};

export default NewPost;
