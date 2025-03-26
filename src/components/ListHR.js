const ListHR = ({ data }) => {
    return (
        <div>
            <h2>HR 리스트</h2>
            <ul>
                {data.map((item) => (
                    <li key={item.id}>{item.name}</li> // item의 구조에 맞게 수정
                ))}
            </ul>
        </div>
    );
}

export default ListHR;