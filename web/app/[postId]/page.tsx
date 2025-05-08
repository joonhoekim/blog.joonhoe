export default function Post({ params }: { params: { postId: string } }) {
	return (
		<>
			<h1>Post</h1>
			<div>{params.postId}</div>
		</>
	);
}
