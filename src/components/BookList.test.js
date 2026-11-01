import {render,screen} from '@testing-library/react';
import BookList from './BookList';
import api from '../api';
jest.mock('../api');
test('renders books returned by the catalog API',async()=>{
 api.get.mockResolvedValue({data:{content:[{id:1,title:'Clean Code',author:'Robert Martin',price:599,stock:4,description:'Craftsmanship'}]}});
 render(<BookList onAdd={jest.fn()}/>);
 expect(await screen.findByText('Clean Code')).toBeInTheDocument();
 expect(screen.getByText('by Robert Martin')).toBeInTheDocument();
});
