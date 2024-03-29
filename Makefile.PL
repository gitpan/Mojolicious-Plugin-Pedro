use strict;
use warnings;

use ExtUtils::MakeMaker;

WriteMakefile(
	NAME          => 'Mojolicious::Plugin::Pedro',
	VERSION_FROM  => 'lib/Mojolicious/Plugin/Pedro.pm',
	ABSTRACT_FROM => 'lib/Mojolicious/Plugin/Pedro.pm',
	AUTHOR        => 'Ahmad M. Zawawi <ahmad.zawawi@gmail.com>',
	PREREQ_PM     => {
		'Mojolicious'  => '3.36',
		'Pod::Index'   => '0.14',
		'Perl::Tidy'   => '20120714',
		'Perl::Critic' => '1.118',
	},
	EXE_FILES => ['script/pedro'],
	test      => { TESTS => 't/*.t' }
);
