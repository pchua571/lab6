import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Redirect } from 'react-router-dom';
import classes from './card.module.css' 
import queries from '../queries';


const Main = (props) => {
    //Separate what is shown based off what the path is (3 are similar)
    const path = window.location.pathname;
    const [pageNum, setPageNum] = useState(1);
    const [deletePost] = useMutation(queries.DEL_IMAGE);
    const [updatePost] = useMutation(queries.UPDATE_IMAGE);

    let query;
    let options;

    if (path === '/') {
        query = queries.GET_UNSPLASHIMAGES;
        options = {
            variables: {
                pageNum: pageNum,
            },
        };
    } else if (path === '/my-bin') {
        query = queries.GET_BINNEDIMAGES;
        options = false;
    } else if (path === '/my-posts') {
        query = queries.GET_USERPOSTEDIMAGES;
        options = false;
    }

    const { loading, error, data } = useQuery(query, options);

    if (loading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <Redirect to="/error" />;
    }

    const nextPage = () => setPageNum(pageNum+1);

    const buildCard = (item) => {
        return (
            <div className={classes.card} key={item.id}>
                <br />
                <img src={item.url} alt="Here's an img"></img>
                <br />
                <p>{item.posterName}</p>
                <p>{item.description}</p>
                <button
                    style={{ display: item.binned ? 'none' : 'block' }}
                    onClick={() => {
                        updatePost({
                            variables: {
                                id: item.id,
                                url: item.url,
                                posterName: item.posterName,
                                description: item.description,
                                userPosted: item.userPosted,
                                binned: true,
                            },
                        });
                    }}
                >
                    Add to Bin
                </button>
                <button
                    style={{ display: item.binned ? 'block' : 'none' }}
                    onClick={() => {
                        updatePost({
                            variables: {
                                id: item.id,
                                url: item.url,
                                posterName: item.posterName,
                                description: item.description,
                                userPosted: item.userPosted,
                                binned: false,
                            },
                        });
                    }}
                >
                    Remove out Bin
                </button>
                <button
                    style={{ display: path === '/my-posts' ? 'block' : 'none' }}
                    onClick={() =>
                        deletePost({
                            variables: {
                                id: item.id,
                            },
                        })
                    }
                >
                    Delete Post
                </button>
            </div>
        );
    };

    const buildList = () => {
        let list;
        if (path === '/'){
        list = data.unsplashImages;
        }
        else if (path === '/my-bin') {
            list = data.binnedImages;
        }
        else if (path === '/my-posts') {
            list = data.userPostedImages;
        }
        if (list.length === 0) {
            return <p>Obtained an empty list</p>;
        }
        const output = list.map((element) => {
            return buildCard(element);
        });
        return output;
    };

    const list = buildList();

    return (
        <div className={classes.container}>
            
            {list}

            <a
                href="/new-post"
                style={{ display: path === '/my-posts' ? 'block' : 'none' }}
            >
                Create New Post
            </a>
            <button
                style={{ display: path === '/' ? 'block' : 'none' }}
                onClick={nextPage}
            >
                Get More
            </button>
        </div>
    );
};

export default Main;
