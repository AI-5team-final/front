import ListApplicant from '../components/ListApplicant';
import ListHR from '../components/ListHR';
import useRole from '../hooks/useRole';

const List = () => {
    // JWT token에서 role 가져오는 것
	const role = useRole();

    return (
        <main className="l-list">
            <div className='inner'>
                <h1>리스트 페이지</h1>
                {role === 'HR' && <ListHR />}
                {role === 'APPLICANT' && <ListApplicant />}
            </div>
        </main>
    );
}

export default List;