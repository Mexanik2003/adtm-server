--
-- PostgreSQL database dump
--

-- Dumped from database version 13.3
-- Dumped by pg_dump version 13.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: sentpins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sentpins (
    id integer NOT NULL,
    telegram_id character varying,
    pin character varying,
    date timestamp without time zone
);


ALTER TABLE public.sentpins OWNER TO postgres;

--
-- Name: sentpins_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sentpins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sentpins_id_seq OWNER TO postgres;

--
-- Name: sentpins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sentpins_id_seq OWNED BY public.sentpins.id;


--
-- Name: task_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_types (
    id integer NOT NULL,
    name character varying NOT NULL,
    fullname character varying,
    view_order integer
);


ALTER TABLE public.task_types OWNER TO postgres;

--
-- Name: task_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.task_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.task_types_id_seq OWNER TO postgres;

--
-- Name: task_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.task_types_id_seq OWNED BY public.task_types.id;


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    user_id integer NOT NULL,
    subject character varying NOT NULL,
    date_created timestamp with time zone,
    date_modified timestamp with time zone,
    type integer,
    text text,
    focused boolean DEFAULT false,
    deadline timestamp with time zone,
    urgent boolean DEFAULT false,
    trashed boolean DEFAULT false,
    completed boolean DEFAULT false,
    start_notify timestamp with time zone
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tasks_id_seq OWNER TO postgres;

--
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    telegram_id integer,
    email character varying NOT NULL,
    pin character varying,
    lastlogin timestamp with time zone,
    fullname character varying,
    jwt character varying,
    timezone character varying,
    notify_freq integer DEFAULT 10,
    last_notified timestamp with time zone,
    telegram_lastaction jsonb
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: sentpins id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sentpins ALTER COLUMN id SET DEFAULT nextval('public.sentpins_id_seq'::regclass);


--
-- Name: task_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_types ALTER COLUMN id SET DEFAULT nextval('public.task_types_id_seq'::regclass);


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: sentpins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sentpins (id, telegram_id, pin, date) FROM stdin;
1	155090468	1470	2021-09-22 16:40:04
2	155090468	6119	2021-09-22 16:42:04
3	155090468	3677	2021-09-22 16:42:26
\.


--
-- Data for Name: task_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_types (id, name, fullname, view_order) FROM stdin;
1	incoming	Входящие	20
4	duedate	Со сроком исполнения	50
6	projects	Проекты	60
3	nextstep	Следующие действия	30
7	paused	Отложенное	40
2	someday	Когда-нибудь	80
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, user_id, subject, date_created, date_modified, type, text, focused, deadline, urgent, trashed, completed, start_notify) FROM stdin;
3	3	Задача3	2021-08-03 14:06:58+05	\N	3	\N	f	\N	f	f	f	\N
7	104	enim. Etiam gravida molestie	2021-02-17 21:58:36+05	\N	6	Sed dictum. Proin eget odio. Aliquam vulputate ullamcorper magna. Sed eu eros. Nam	f	\N	f	f	f	\N
5	3	nonummy ut, molestie in, tempus eu, ligula. Aenean	2021-07-20 14:54:00+05	\N	6	risus. In mi pede, nonummy ut, molestie in, tempus eu, ligula. Aenean euismod mauris eu elit. Nulla facilisi. Sed neque. Sed eget lacus. Mauris non	f	\N	f	f	f	\N
6	3	ut ipsum ac mi	2020-10-11 17:25:45+05	\N	7	nisi nibh lacinia orci, consectetuer euismod est arcu ac orci. Ut semper pretium	f	\N	f	f	f	\N
15	3	tempor lorem, eget mollis lectus pede et risus.	2021-04-27 06:41:36+05	\N	4	mauris ipsum porta elit, a feugiat tellus lorem eu metus. In lorem. Donec elementum, lorem ut aliquam iaculis, lacus pede sagittis	f	\N	f	f	f	\N
17	3	vel, convallis in, cursus et, eros. Proin	2020-11-17 22:46:31+05	\N	3	arcu. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae Donec tincidunt. Donec vitae	f	\N	f	f	f	\N
24	3	Aenean euismod mauris eu elit. Nulla	2020-12-27 19:42:10+05	\N	7	Aliquam rutrum lorem ac risus. Morbi metus. Vivamus euismod urna. Nullam lobortis quam a felis ullamcorper viverra. Maecenas iaculis	f	\N	f	f	f	\N
28	3	id ante dictum cursus. Nunc mauris	2021-05-06 11:16:46+05	\N	6	a nunc. In at pede. Cras vulputate velit eu sem. Pellentesque ut ipsum ac mi eleifend egestas. Sed pharetra, felis eget varius	f	\N	f	f	f	\N
34	3	luctus lobortis. Class aptent taciti sociosqu	2021-08-10 19:24:14+05	\N	3	dui. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean eget magna. Suspendisse tristique neque venenatis lacus. Etiam bibendum fermentum metus. Aenean sed pede nec	f	\N	f	f	f	\N
35	3	aliquet nec, imperdiet nec, leo. Morbi	2021-09-09 17:11:29+05	\N	4	dis parturient montes, nascetur ridiculus mus. Proin vel arcu eu odio tristique pharetra. Quisque ac	f	\N	f	f	f	\N
1	3	Задача1	2021-05-31 17:15:00+05	\N	1	\N	f	\N	f	f	f	\N
9	104	Duis sit amet diam eu dolor egestas rhoncus. Proin nisl	2021-08-24 10:29:06+05	\N	7	dignissim pharetra. Nam ac nulla. In tincidunt congue turpis. In condimentum. Donec at arcu. Vestibulum ante ipsum primis in	f	\N	f	f	f	\N
12	104	ipsum primis in faucibus orci luctus et ultrices posuere	2021-06-10 22:53:46+05	\N	1	mollis nec, cursus a, enim. Suspendisse aliquet, sem ut cursus luctus, ipsum leo elementum sem, vitae aliquam eros turpis non enim. Mauris	f	\N	f	f	f	\N
16	104	lorem eu metus.	2021-08-31 21:37:36+05	\N	6	vitae sodales nisi magna sed dui. Fusce aliquam, enim nec tempus scelerisque, lorem ipsum sodales purus, in	f	\N	f	f	f	\N
20	104	felis. Nulla tempor augue ac ipsum. Phasellus vitae mauris sit	2021-01-16 04:48:37+05	\N	3	at, libero. Morbi accumsan laoreet ipsum. Curabitur consequat, lectus sit amet luctus vulputate, nisi sem semper erat, in consectetuer ipsum nunc id enim.	f	\N	f	f	f	\N
13	104	per conubia nostra, per inceptos hymenaeos. Mauris ut quam	2021-07-15 18:44:09+05	\N	3	dictum mi, ac mattis velit justo nec ante. Maecenas mi felis, adipiscing fringilla, porttitor vulputate, posuere vulputate, lacus.	f	\N	f	f	f	\N
14	104	Nullam ut nisi a odio semper cursus. Integer mollis.	2021-08-13 10:47:18+05	\N	6	sem molestie sodales. Mauris blandit enim consequat purus. Maecenas libero est, congue	f	\N	f	f	f	\N
4	104	Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut	2021-09-23 03:16:04+05	\N	7	montes, nascetur ridiculus mus. Aenean eget magna. Suspendisse tristique neque venenatis lacus. Etiam bibendum fermentum	f	\N	f	f	f	\N
19	3	lorem, luctus ut,	2021-06-14 01:17:22+05	\N	2	aliquet nec, imperdiet nec, leo. Morbi neque tellus, imperdiet non, vestibulum nec, euismod in, dolor. Fusce feugiat. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam	f	\N	f	f	f	\N
29	3	Curae Phasellus ornare. Fusce	2021-01-02 12:08:11+05	\N	4	ut mi. Duis risus odio, auctor vitae, aliquet nec, imperdiet nec, leo. Morbi neque tellus, imperdiet non, vestibulum nec,	f	\N	f	f	f	\N
11	3	est mauris, rhoncus id, mollis nec, cursus a, enim. Suspendisse	2020-12-04 00:49:06+05	\N	3	ac risus. Morbi metus. Vivamus euismod urna. Nullam lobortis quam a felis ullamcorper viverra. Maecenas iaculis	f	\N	f	f	f	\N
36	3	primis in faucibus orci	2020-12-01 20:01:39+05	\N	4	sed pede nec ante blandit viverra. Donec tempus, lorem fringilla ornare placerat, orci lacus vestibulum lorem, sit amet ultricies sem magna nec quam. Curabitur vel lectus. Cum sociis natoque	f	\N	f	f	f	\N
21	3	tincidunt, neque vitae semper egestas, urna	2020-12-24 21:47:35+05	\N	7	ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae Phasellus ornare. Fusce mollis. Duis sit amet diam eu dolor egestas rhoncus. Proin nisl	f	\N	f	f	f	\N
22	3	quam a felis ullamcorper viverra. Maecenas iaculis aliquet diam. Sed	2021-06-21 01:05:26+05	\N	4	diam. Proin dolor. Nulla semper tellus id nunc interdum feugiat. Sed nec metus facilisis lorem	f	\N	f	f	f	\N
8	3	nec urna suscipit nonummy.	2020-10-23 09:02:12+05	\N	4	non enim commodo hendrerit. Donec porttitor tellus non magna. Nam ligula elit, pretium et, rutrum non, hendrerit	f	\N	f	f	f	\N
25	3	Mauris blandit enim consequat purus.	2021-03-21 23:42:09+05	\N	6	nec, euismod in, dolor. Fusce feugiat. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam	f	\N	f	f	f	\N
42	3	luctus et ultrices	2021-07-23 03:50:29+05	\N	4	vel, convallis in, cursus et, eros. Proin ultrices. Duis volutpat	f	\N	f	f	f	\N
45	3	semper. Nam tempor diam dictum sapien.	2021-04-23 10:44:08+05	\N	6	mi tempor lorem, eget mollis lectus pede et risus. Quisque libero lacus, varius et, euismod et, commodo at, libero. Morbi accumsan laoreet ipsum.	f	\N	f	f	f	\N
40	104	laoreet ipsum. Curabitur consequat, lectus sit amet luctus	2021-05-21 19:09:39+05	\N	7	malesuada vel, convallis in, cursus et, eros. Proin ultrices. Duis volutpat nunc sit amet metus. Aliquam	f	\N	f	f	f	\N
30	3	ad litora torquent	2021-09-12 23:35:03+05	2021-10-05 08:26:10+05	1	nisl arcu iaculis enim, sit amet ornare lectus justo eu arcu. Morbi	f	\N	f	f	f	\N
39	104	ipsum dolor sit amet, consectetuer adipiscing	2021-07-31 08:39:28+05	\N	2	nonummy ultricies ornare, elit elit fermentum risus, at fringilla purus mauris a nunc. In at pede. Cras vulputate velit eu sem. Pellentesque ut ipsum ac mi eleifend	f	\N	f	f	f	\N
43	104	turpis. Nulla aliquet. Proin velit. Sed malesuada augue ut lacus.	2020-12-27 09:18:48+05	\N	6	pede, malesuada vel, venenatis vel, faucibus id, libero. Donec consectetuer mauris id sapien. Cras dolor dolor,	f	\N	f	f	f	\N
23	3	Измененная задача2	2020-12-22 03:37:03+05	2021-10-05 14:12:46.797+05	2	Это текст измененной задачи 2	t	\N	f	f	f	\N
2	3	Задача2	2021-06-25 11:17:36+05	2021-10-05 14:35:05.027+05	2	\N	f	\N	f	f	f	\N
48	104	Nullam nisl. Maecenas malesuada fringilla	2021-05-03 07:23:40+05	\N	7	condimentum. Donec at arcu. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae Donec tincidunt. Donec vitae erat vel pede blandit	f	\N	f	f	f	\N
37	3	Donec sollicitudin adipiscing ligula. Aenean gravida nunc sed pede.	2020-12-20 18:26:32+05	\N	1	elementum sem, vitae aliquam eros turpis non enim. Mauris quis turpis vitae purus gravida sagittis. Duis gravida.	f	\N	f	f	f	\N
46	3	nec, cursus a, enim. Suspendisse aliquet, sem	2020-11-22 19:38:40+05	\N	1	Duis dignissim tempor arcu. Vestibulum ut eros non enim commodo hendrerit. Donec porttitor tellus non magna. Nam ligula elit, pretium et, rutrum	f	\N	f	f	f	\N
47	3	pulvinar arcu et pede.	2021-09-14 23:52:32+05	\N	3	justo faucibus lectus, a sollicitudin orci sem eget massa. Suspendisse eleifend. Cras sed leo. Cras vehicula aliquet libero. Integer in magna. Phasellus dolor elit, pellentesque a, facilisis	f	\N	f	f	f	\N
52	3	fringilla ornare placerat, orci lacus vestibulum	2021-08-26 13:13:43+05	\N	3	vitae, orci. Phasellus dapibus quam quis diam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce	f	\N	f	f	f	\N
49	3	nec, malesuada ut, sem. Nulla interdum. Curabitur dictum. Phasellus	2020-12-05 13:38:08+05	\N	7	at fringilla purus mauris a nunc. In at pede. Cras vulputate velit eu	f	\N	f	f	f	\N
51	3	non dui nec urna	2021-08-19 18:02:13+05	\N	4	habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam fringilla cursus purus. Nullam	f	\N	f	f	f	\N
10	3	montes, nascetur ridiculus mus. Proin vel nisl.	2021-07-28 17:18:35+05	\N	2	sed turpis nec mauris blandit mattis. Cras eget nisi dictum augue malesuada malesuada. Integer id magna et ipsum cursus vestibulum. Mauris magna. Duis dignissim tempor arcu. Vestibulum ut eros	f	\N	f	f	f	\N
33	3	ridiculus mus. Proin vel nisl. Quisque	2021-08-27 12:38:53+05	2021-10-05 18:24:18+05	7	quis diam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce aliquet magna a neque. Nullam ut nisi a odio	f	2021-10-05 17:00:01+05	f	f	f	\N
32	3	quam vel sapien imperdiet	2020-12-23 21:07:52+05	2021-10-05 14:15:44.925+05	2	dis parturient montes, nascetur ridiculus mus. Proin vel nisl. Quisque fringilla euismod enim. Etiam gravida molestie arcu. Sed eu nibh vulputate mauris sagittis	f	\N	f	f	f	\N
27	3	sit amet, consectetuer adipiscing elit.	2021-04-27 02:40:41+05	2021-10-05 14:15:48.083+05	7	velit in aliquet lobortis, nisi nibh lacinia orci, consectetuer euismod est arcu ac orci. Ut semper pretium neque. Morbi quis urna.	f	\N	f	f	f	\N
62	3	ццццццццццццццц	\N	2021-10-05 14:23:49.744+05	3	\N	f	\N	f	f	f	\N
69	3	Айдеко собеседование зум	\N	2021-10-11 12:17:32.337+05	1	\N	f	2021-10-11 13:00:00+05	f	f	t	\N
60	3	Купить банан	\N	2021-10-06 07:24:13.048+05	6	\N	f	2021-10-06 10:00:00+05	f	f	f	\N
63	3	Leetcode contest	\N	2021-10-10 07:27:39.881+05	1	\N	f	2021-10-10 07:30:00+05	f	f	t	\N
67	3	апоп	\N	2021-10-08 12:20:42.22+05	1	\N	f	\N	f	t	f	\N
66	3	мпопмор	\N	2021-10-08 12:22:33.516+05	1	\N	f	\N	f	t	f	\N
64	3	ыва	\N	2021-10-08 12:22:41.51+05	1	\N	f	\N	f	t	f	\N
65	3	апнпопа	\N	2021-10-08 12:22:53.026+05	1	\N	f	\N	f	t	f	\N
61	3	as	\N	2021-10-08 12:23:04.499+05	1	\N	f	\N	f	t	f	\N
56	3	ss	\N	2021-10-08 12:23:10.624+05	1	\N	f	\N	f	t	f	\N
59	3	safsdfs	\N	2021-10-08 12:23:22.918+05	1	\N	f	\N	f	t	f	\N
58	3	safd	\N	2021-10-08 12:23:27.827+05	1	\N	f	\N	f	t	f	\N
57	3	ghj	\N	2021-10-08 12:23:32.104+05	1	\N	f	\N	f	t	f	\N
68	3	Дедлайн на собеседование: ул. Ленина 50б, офис 515	\N	2021-10-13 13:41:44.788+05	4	\N	f	2021-10-13 10:00:00+05	f	f	t	2021-10-13 14:00:00+05
44	104	ante blandit viverra. Donec tempus, lorem fringilla ornare placerat,	2020-12-26 07:34:31+05	2021-10-09 09:43:12.613+05	1	arcu eu odio tristique pharetra. Quisque ac libero nec ligula consectetuer	f	\N	f	f	f	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, telegram_id, email, pin, lastlogin, fullname, jwt, timezone, notify_freq, last_notified, telegram_lastaction) FROM stdin;
3	155090468	a@a.ru		2021-10-06 12:36:54.996+05	Алексей	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoie1wiaWRcIjozLFwidGVsZWdyYW1faWRcIjoxNTUwOTA0NjgsXCJlbWFpbFwiOlwiYUBhLnJ1XCIsXCJwaW5cIjpcIlwiLFwibGFzdGxvZ2luXCI6XCIyMDIxLTEwLTAzVDExOjA1OjM2LjAwMFpcIixcImZ1bGxuYW1lXCI6XCLQkNC70LXQutGB0LXQuVwiLFwiand0XCI6XCJcIixcInRpbWV6b25lXCI6XCIzMDBcIixcIm5vdGlmeV9mcmVxXCI6MTAsXCJsYXN0X25vdGlmaWVkXCI6XCIyMDIxLTEwLTA1VDE2OjE5OjEyLjAwMFpcIixcInRlbGVncmFtX2xhc3RhY3Rpb25cIjpudWxsfSIsImlhdCI6MTYzMzUwNTgxNH0.ZjxKTm8gsbPDro2zO_UJOfabvV81wWqisq9mjL7eYtc	300	10	2021-10-13 13:28:14+05	\N
104	616165889	b@b.ru		2021-10-09 08:41:30.471+05	Петров Петр	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoie1wiaWRcIjoxMDQsXCJ0ZWxlZ3JhbV9pZFwiOjYxNjE2NTg4OSxcImVtYWlsXCI6XCJiQGIucnVcIixcInBpblwiOlwiXCIsXCJsYXN0bG9naW5cIjpcIjIwMjEtMTAtMDlUMDM6NDE6MDYuNzMwWlwiLFwiZnVsbG5hbWVcIjpcItCf0LXRgtGA0L7QsiDQn9C10YLRgFwiLFwiand0XCI6XCJcIixcInRpbWV6b25lXCI6XCIzMDBcIixcIm5vdGlmeV9mcmVxXCI6MTAsXCJsYXN0X25vdGlmaWVkXCI6XCIyMDIxLTEwLTA1VDA5OjA5OjU0LjAwMFpcIixcInRlbGVncmFtX2xhc3RhY3Rpb25cIjpudWxsfSIsImlhdCI6MTYzMzc1MDg5MH0.i60YCD9WAuRuw5d8EPAi8c1fgpWTpnhk5OzylAoSexc	300	10	2021-10-05 14:09:54+05	\N
\.


--
-- Name: sentpins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sentpins_id_seq', 3, true);


--
-- Name: task_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.task_types_id_seq', 8, true);


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tasks_id_seq', 69, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 125, true);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- PostgreSQL database dump complete
--

