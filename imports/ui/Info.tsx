import React from 'react';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import { LinksCollection, Link } from '../api/links';

export const Info: React.FC = () => {
    const isLoading = useSubscribe('links');
    const links = useFind<Link>(() => LinksCollection.find());

    if (isLoading()) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Learn Meteor!</h2>
            <ul>
                {links.map((link) => (
                    <li key={link._id}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                            {link.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};
