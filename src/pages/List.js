import ListApplicant from '../components/ListApplicant';
import ListHR from '../components/ListHR';
import useToken from '../hooks/useToken';

const List = () => {
    const { role } = useToken();

    return (
        <main className="l-list">
            <div className='inner'>
                {role === 'HR' && <ListHR />}
                {role === 'APPLICANT' && <ListApplicant />}
            </div>
        </main>
    );
}

export default List;