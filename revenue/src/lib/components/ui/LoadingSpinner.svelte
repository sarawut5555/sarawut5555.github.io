<script lang="ts">
	interface Props {
		size?: 'sm' | 'md' | 'lg';
	}

	let { size = 'md' }: Props = $props();
	const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
</script>

<div
	class="inline-block animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600 dark:border-slate-600 dark:border-t-indigo-400 {sizes[size]}"
	role="status"
	aria-label="Loading"
></div>
